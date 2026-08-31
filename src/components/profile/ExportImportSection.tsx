import { useRef } from "react";

import type { WorkoutStore } from "../../data/storage";
import { useExportImport } from "../../hooks/useExportImport";
import { Button } from "../button/Button";
import { Dialog } from "../dialog/Dialog";
import { Row } from "../row/Row";
import { SectionCard } from "../sectioncard/SectionCard";
import { Span } from "../text/Span";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
};

export const ExportImportSection = ({ store, update }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { status, exportJson, exportCsv, handleFiles, confirmJsonImport, cancel } = useExportImport(
    store,
    update,
  );

  return (
    <SectionCard
      title="Export & import data"
      description="Save your programs, workout history, and weigh-ins to a file, or restore them on another device."
      gap="sm"
    >
      <Row justify="start" gap="sm">
        <Button label="Export as JSON" variant="secondary" onClick={exportJson} />
        <Button label="Export as CSV" variant="secondary" onClick={exportCsv} />
      </Row>
      <Row justify="start" gap="sm">
        <Button label="Import file" variant="secondary" onClick={() => fileInputRef.current?.click()} />
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          multiple
          hidden
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </Row>
      {status.kind === "error" && <Span text={status.message} size="small" />}
      {status.kind === "csv-done" && (
        <Span
          text={`Imported ${status.summary.bodyWeightCount} weigh-ins, ${status.summary.historyCount} workouts, and ${status.summary.cardioCount} cardio sessions.`}
          size="small"
        />
      )}
      <Dialog
        title="Import JSON backup?"
        isOpen={status.kind === "json-ready"}
        onClose={cancel}
        actionLabel="Cancel"
        destructiveAction={{
          label: "Replace all data",
          onClick: confirmJsonImport,
          ariaLabel: "Confirm replacing all data with the imported file",
        }}
      >
        <Span text="This replaces all current programs, history, and weigh-ins with the contents of the imported file. This can't be undone." />
      </Dialog>
    </SectionCard>
  );
};
