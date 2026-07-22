import { useState } from "react";

import { exportStoreAsCsv, exportStoreAsJson } from "../data/export";
import { importCsvFiles, importJsonStore, type ImportSummary } from "../data/import";
import type { WorkoutStore } from "../data/storage";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type ImportStatus =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "json-ready"; store: WorkoutStore }
  | { kind: "csv-done"; summary: ImportSummary };

type ExportImportState = {
  status: ImportStatus;
  exportJson: () => void;
  exportCsv: () => void;
  handleFiles: (files: FileList | null) => Promise<void>;
  confirmJsonImport: () => void;
  cancel: () => void;
};

const useExportImport = (store: WorkoutStore, update: UpdateFn): ExportImportState => {
  const [status, setStatus] = useState<ImportStatus>({ kind: "idle" });

  const exportJson = () => exportStoreAsJson(store);
  const exportCsv = () => exportStoreAsCsv(store);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const fileArray = [...files];

    try {
      const jsonFile = fileArray.find((file) => file.name.toLowerCase().endsWith(".json"));
      const csvFiles = fileArray.filter((file) => file.name.toLowerCase().endsWith(".csv"));

      if (jsonFile) {
        const text = await jsonFile.text();
        const imported = importJsonStore(text);
        setStatus({ kind: "json-ready", store: imported });
        return;
      }

      if (csvFiles.length > 0) {
        const texts = await Promise.all(
          csvFiles.map(async (file) => ({ name: file.name, text: await file.text() })),
        );
        const { store: nextStore, summary } = importCsvFiles(store, texts);
        update(() => nextStore);
        setStatus({ kind: "csv-done", summary });
        return;
      }

      setStatus({ kind: "error", message: "Unsupported file type. Choose a .json or .csv export." });
    } catch {
      setStatus({ kind: "error", message: "Couldn't read that file. Make sure it's a Styrka export." });
    }
  };

  const confirmJsonImport = () => {
    if (status.kind !== "json-ready") {
      return;
    }
    update(() => status.store);
    setStatus({ kind: "idle" });
  };

  const cancel = () => setStatus({ kind: "idle" });

  return { status, exportJson, exportCsv, handleFiles, confirmJsonImport, cancel };
};

export { useExportImport };
