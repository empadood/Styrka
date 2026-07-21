import { parseStore, type WorkoutStore } from "./storage";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const FILE_NAME = "styrka-workout-store.json";
const DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files";

let gisLoadPromise: Promise<void> | null = null;

const ensureGisLoaded = (): Promise<void> => {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }
  if (gisLoadPromise) {
    return gisLoadPromise;
  }

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });

  return gisLoadPromise;
};

const requestAccessToken = async (): Promise<string> => {
  await ensureGisLoaded();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("Google Drive sync is not configured (missing VITE_GOOGLE_CLIENT_ID).");
  }

  return new Promise((resolve, reject) => {
    const tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token);
        } else {
          reject(new Error(response.error ?? "Google sign-in was cancelled or failed."));
        }
      },
    });
    tokenClient.requestAccessToken();
  });
};

const findOrCreateFileId = async (token: string): Promise<string> => {
  const query = new URLSearchParams({
    spaces: "appDataFolder",
    q: `name='${FILE_NAME}'`,
    fields: "files(id)",
  });

  const listResponse = await fetch(`${DRIVE_FILES_URL}?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listResponse.ok) {
    throw new Error("Failed to look up the backup file on Google Drive.");
  }
  const listData = await listResponse.json();
  const existingId = listData.files?.[0]?.id as string | undefined;
  if (existingId) {
    return existingId;
  }

  const createResponse = await fetch(DRIVE_FILES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: FILE_NAME, parents: ["appDataFolder"] }),
  });
  if (!createResponse.ok) {
    throw new Error("Failed to create the backup file on Google Drive.");
  }
  const createData = await createResponse.json();
  return createData.id as string;
};

const downloadStore = async (
  token: string,
  fileId: string,
): Promise<WorkoutStore | null> => {
  const response = await fetch(`${DRIVE_FILES_URL}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to download the backup from Google Drive.");
  }
  const text = await response.text();
  if (!text) {
    return null;
  }
  return parseStore(text);
};

const uploadStore = async (
  token: string,
  fileId: string,
  store: WorkoutStore,
): Promise<void> => {
  const response = await fetch(
    `${DRIVE_UPLOAD_URL}/${fileId}?uploadType=media`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(store),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to upload the backup to Google Drive.");
  }
};

type SyncOutcome =
  | { direction: "pushed" }
  | { direction: "up-to-date" }
  | { direction: "conflict"; remoteStore: WorkoutStore };

const syncNow = async (localStore: WorkoutStore): Promise<SyncOutcome> => {
  const token = await requestAccessToken();
  const fileId = await findOrCreateFileId(token);
  const remoteStore = await downloadStore(token, fileId);

  if (!remoteStore || remoteStore.updatedAt <= localStore.updatedAt) {
    await uploadStore(token, fileId, localStore);
    return remoteStore?.updatedAt === localStore.updatedAt
      ? { direction: "up-to-date" }
      : { direction: "pushed" };
  }

  return { direction: "conflict", remoteStore };
};

export { syncNow };
