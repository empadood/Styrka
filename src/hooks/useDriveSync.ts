import { useState } from "react";

import { syncNow } from "../data/google-drive-sync";
import type { WorkoutStore } from "../data/storage";

// Cloud sync UI is hidden for now — flip to true (or gate on env config) to bring it back.
const DRIVE_SYNC_UI_ENABLED = false;

type SyncStatus = "idle" | "syncing" | "success" | "error" | "conflict";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export type DriveSyncState = {
  status: SyncStatus;
  errorMessage: string | null;
  pendingRemoteStore: WorkoutStore | null;
  sync: () => Promise<void>;
  confirmPullRemote: () => void;
  dismissConflict: () => void;
};

const useDriveSync = (store: WorkoutStore, update: UpdateFn): DriveSyncState => {
  const [status, setStatus] = useState<SyncStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRemoteStore, setPendingRemoteStore] = useState<WorkoutStore | null>(null);

  const sync = async () => {
    setStatus("syncing");
    setErrorMessage(null);
    try {
      const outcome = await syncNow(store);
      if (outcome.direction === "conflict") {
        setPendingRemoteStore(outcome.remoteStore);
        setStatus("conflict");
      } else {
        setStatus("success");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sync failed.");
      setStatus("error");
    }
  };

  const confirmPullRemote = () => {
    if (!pendingRemoteStore) {
      return;
    }
    update(() => pendingRemoteStore);
    setPendingRemoteStore(null);
    setStatus("success");
  };

  const dismissConflict = () => {
    setPendingRemoteStore(null);
    setStatus("idle");
  };

  return { status, errorMessage, pendingRemoteStore, sync, confirmPullRemote, dismissConflict };
};

export { DRIVE_SYNC_UI_ENABLED, useDriveSync };
