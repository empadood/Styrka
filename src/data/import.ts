import type {
  BodyWeightEntry,
  LoggedCardioSession,
  LoggedExercise,
  LoggedSet,
  WorkoutHistoryEntry,
} from "../types";
import { parseCsvRecords } from "./csv";
import { parseStore, type WorkoutStore } from "./storage";

type CsvFile = { name: string; text: string };

type ImportSummary = {
  bodyWeightCount: number;
  historyCount: number;
  cardioCount: number;
};

const toNumber = (value: string): number | undefined => (value === "" ? undefined : Number(value));
const toBool = (value: string): boolean => value === "true";
const toOptionalString = (value: string): string | undefined => (value === "" ? undefined : value);
const toNullableString = (value: string): string | null => (value === "" ? null : value);

const detectCsvKind = (headers: string[]): "bodyweight" | "workout-history" | "cardio" | null => {
  if (headers.includes("weight") && headers.includes("bodyFatPercent") && !headers.includes("exerciseId")) {
    return "bodyweight";
  }
  if (headers.includes("exerciseId") && headers.includes("setIndex")) {
    return "workout-history";
  }
  if (headers.includes("activityId") && headers.includes("durationSeconds")) {
    return "cardio";
  }
  return null;
};

const parseBodyWeightCsv = (records: Record<string, string>[]): BodyWeightEntry[] =>
  records
    .filter((record) => record.id && record.date)
    .map((record) => ({
      id: record.id,
      date: record.date,
      weight: Number(record.weight),
      bodyFatPercent: toNumber(record.bodyFatPercent),
    }));

const parseWorkoutHistoryCsv = (records: Record<string, string>[]): WorkoutHistoryEntry[] => {
  const entryMap = new Map<string, Record<string, string>[]>();
  for (const record of records) {
    if (!record.entryId) {
      continue;
    }
    const list = entryMap.get(record.entryId) ?? [];
    list.push(record);
    entryMap.set(record.entryId, list);
  }

  const entries: WorkoutHistoryEntry[] = [];

  for (const [entryId, rows] of entryMap) {
    const first = rows[0];
    const rpe = toNumber(first.rpe);
    const notes = toOptionalString(first.notes);

    const exerciseMap = new Map<number, Record<string, string>[]>();
    for (const row of rows) {
      const exerciseIndex = Number(row.exerciseIndex);
      const list = exerciseMap.get(exerciseIndex) ?? [];
      list.push(row);
      exerciseMap.set(exerciseIndex, list);
    }

    const exercises: LoggedExercise[] = [...exerciseMap.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, exerciseRows]) => {
        const exFirst = exerciseRows[0];
        const sets: LoggedSet[] = exerciseRows
          .filter((row) => row.setIndex !== "")
          .sort((a, b) => Number(a.setIndex) - Number(b.setIndex))
          .map((row) => ({
            targetReps: Number(row.targetReps),
            reps: Number(row.reps),
            weight: Number(row.weight),
          }));

        const tracked = toBool(exFirst.tracked);
        return {
          exerciseId: exFirst.exerciseId,
          label: exFirst.exerciseLabel,
          tracked,
          isAdHoc: toBool(exFirst.isAdHoc),
          sets,
          completed: toBool(exFirst.exerciseCompleted),
          weightUsed: Number(exFirst.weightUsed),
          showWeightIndicator:
            exFirst.showWeightIndicator !== undefined ? toBool(exFirst.showWeightIndicator) : tracked,
          showWarmupSets:
            exFirst.showWarmupSets !== undefined ? toBool(exFirst.showWarmupSets) : true,
          sourceLabel: toOptionalString(exFirst.sourceLabel),
        };
      });

    entries.push({
      id: entryId,
      date: first.date,
      programId: toNullableString(first.programId),
      sessionId: toNullableString(first.sessionId),
      subProgramId: toNullableString(first.subProgramId),
      subSessionId: toNullableString(first.subSessionId),
      sessionLabel: first.sessionLabel,
      exercises,
      cardio: [],
      checkIn: rpe !== undefined || notes ? { rpe: rpe ?? 0, notes: notes ?? "" } : undefined,
    });
  }

  return entries;
};

const parseCardioCsv = (records: Record<string, string>[]): Map<string, LoggedCardioSession[]> => {
  const cardioByEntry = new Map<string, LoggedCardioSession[]>();
  for (const record of records) {
    if (!record.entryId || !record.cardioId) {
      continue;
    }
    const list = cardioByEntry.get(record.entryId) ?? [];
    list.push({
      id: record.cardioId,
      activityId: record.activityId as LoggedCardioSession["activityId"],
      label: record.label,
      durationSeconds: Number(record.durationSeconds),
      kcal: Number(record.kcal),
      isRunning: toBool(record.isRunning),
      startedAt: toNullableString(record.startedAt),
      isFinished: toBool(record.isFinished),
      isSaved: toBool(record.isSaved),
    });
    cardioByEntry.set(record.entryId, list);
  }
  return cardioByEntry;
};

const upsertById = <T extends { id: string }>(existing: T[], incoming: T[]): T[] => {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of incoming) {
    byId.set(item.id, item);
  }
  return [...byId.values()];
};

const importJsonStore = (text: string): WorkoutStore => parseStore(text);

const importCsvFiles = (
  store: WorkoutStore,
  files: CsvFile[],
): { store: WorkoutStore; summary: ImportSummary } => {
  let bodyWeightLog = store.bodyWeightLog;
  let history = store.history;
  let bodyWeightCount = 0;
  let historyCount = 0;
  let cardioCount = 0;
  let cardioByEntry = new Map<string, LoggedCardioSession[]>();

  for (const file of files) {
    const records = parseCsvRecords(file.text);
    if (records.length === 0) {
      continue;
    }
    const kind = detectCsvKind(Object.keys(records[0]));

    if (kind === "bodyweight") {
      const parsed = parseBodyWeightCsv(records);
      bodyWeightLog = upsertById(bodyWeightLog, parsed);
      bodyWeightCount += parsed.length;
    } else if (kind === "workout-history") {
      const parsed = parseWorkoutHistoryCsv(records);
      history = upsertById(history, parsed);
      historyCount += parsed.length;
    } else if (kind === "cardio") {
      cardioByEntry = parseCardioCsv(records);
      cardioCount += records.length;
    }
  }

  if (cardioByEntry.size > 0) {
    history = history.map((entry) =>
      cardioByEntry.has(entry.id) ? { ...entry, cardio: cardioByEntry.get(entry.id) ?? entry.cardio } : entry,
    );
  }

  return {
    store: { ...store, bodyWeightLog, history },
    summary: { bodyWeightCount, historyCount, cardioCount },
  };
};

export { type CsvFile, importCsvFiles, importJsonStore, type ImportSummary };
