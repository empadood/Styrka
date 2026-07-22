import type { BodyWeightEntry, LoggedCardioSession, WorkoutHistoryEntry } from "../types";
import { stringifyCsv } from "./csv";
import type { WorkoutStore } from "./storage";

const todayStamp = (): string => new Date().toISOString().slice(0, 10);

const downloadTextFile = (filename: string, content: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildBodyWeightCsv = (log: BodyWeightEntry[]): string =>
  stringifyCsv(
    ["id", "date", "weight", "bodyFatPercent"],
    log.map((entry) => [entry.id, entry.date, entry.weight, entry.bodyFatPercent]),
  );

const buildWorkoutHistoryCsv = (history: WorkoutHistoryEntry[]): string => {
  const rows: (string | number | boolean | null | undefined)[][] = [];

  for (const entry of history) {
    const rpe = entry.checkIn?.rpe;
    const notes = entry.checkIn?.notes;

    entry.exercises.forEach((exercise, exerciseIndex) => {
      const sets = exercise.sets.length > 0 ? exercise.sets : [null];
      sets.forEach((set, setIndex) => {
        rows.push([
          entry.id,
          entry.date,
          entry.programId,
          entry.sessionId,
          entry.subProgramId,
          entry.subSessionId,
          entry.sessionLabel,
          rpe,
          notes,
          exerciseIndex,
          exercise.exerciseId,
          exercise.label,
          exercise.tracked,
          exercise.isAdHoc,
          exercise.sourceLabel,
          exercise.completed,
          exercise.weightUsed,
          set ? setIndex : "",
          set?.targetReps,
          set?.reps,
          set?.weight,
        ]);
      });
    });
  }

  return stringifyCsv(
    [
      "entryId",
      "date",
      "programId",
      "sessionId",
      "subProgramId",
      "subSessionId",
      "sessionLabel",
      "rpe",
      "notes",
      "exerciseIndex",
      "exerciseId",
      "exerciseLabel",
      "tracked",
      "isAdHoc",
      "sourceLabel",
      "exerciseCompleted",
      "weightUsed",
      "setIndex",
      "targetReps",
      "reps",
      "weight",
    ],
    rows,
  );
};

const buildCardioCsv = (history: WorkoutHistoryEntry[]): string => {
  const rows: (string | number | boolean | null | undefined)[][] = [];

  for (const entry of history) {
    entry.cardio.forEach((session: LoggedCardioSession) => {
      rows.push([
        entry.id,
        entry.date,
        session.id,
        session.activityId,
        session.label,
        session.durationSeconds,
        session.kcal,
        session.isRunning,
        session.startedAt,
        session.isFinished,
        session.isSaved,
      ]);
    });
  }

  return stringifyCsv(
    [
      "entryId",
      "date",
      "cardioId",
      "activityId",
      "label",
      "durationSeconds",
      "kcal",
      "isRunning",
      "startedAt",
      "isFinished",
      "isSaved",
    ],
    rows,
  );
};

const exportStoreAsJson = (store: WorkoutStore): void => {
  downloadTextFile(
    `styrka-export-${todayStamp()}.json`,
    JSON.stringify(store, null, 2),
    "application/json",
  );
};

const exportStoreAsCsv = (store: WorkoutStore): void => {
  const stamp = todayStamp();
  downloadTextFile(`styrka-bodyweight-${stamp}.csv`, buildBodyWeightCsv(store.bodyWeightLog), "text/csv");
  downloadTextFile(
    `styrka-workout-history-${stamp}.csv`,
    buildWorkoutHistoryCsv(store.history),
    "text/csv",
  );
  downloadTextFile(`styrka-cardio-${stamp}.csv`, buildCardioCsv(store.history), "text/csv");
};

export { exportStoreAsCsv, exportStoreAsJson };
