import type { ExerciseName, SessionType, WorkoutHistoryEntry } from "../types";

const STORAGE_KEY = "styrka.workout-store.v1";

interface WorkoutStore {
  workingWeights: Record<ExerciseName, number>;
  estimatedOneRepMax: Record<ExerciseName, number> | null;
  hasConfiguredOneRepMax: boolean;
  increments: Record<ExerciseName, number>;
  lastCompletedSession: SessionType | null;
  history: WorkoutHistoryEntry[];
}

const DEFAULT_STORE: WorkoutStore = {
  workingWeights: { squat: 20, deadlift: 40, ohp: 20, benchpress: 20 },
  estimatedOneRepMax: null,
  hasConfiguredOneRepMax: false,
  increments: { squat: 5, deadlift: 5, ohp: 2.5, benchpress: 2.5 },
  lastCompletedSession: null,
  history: [],
};

const loadStore = (): WorkoutStore => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_STORE;
  }

  try {
    const parsed = JSON.parse(raw);
    const history = Array.isArray(parsed.history) ? parsed.history : [];

    return {
      workingWeights: {
        ...DEFAULT_STORE.workingWeights,
        ...parsed.workingWeights,
      },
      estimatedOneRepMax: parsed.estimatedOneRepMax ?? null,
      hasConfiguredOneRepMax:
        parsed.hasConfiguredOneRepMax ??
        (Boolean(parsed.estimatedOneRepMax) || history.length > 0),
      increments: { ...DEFAULT_STORE.increments, ...parsed.increments },
      lastCompletedSession: parsed.lastCompletedSession ?? null,
      history,
    };
  } catch {
    return DEFAULT_STORE;
  }
};

const saveStore = (store: WorkoutStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export { DEFAULT_STORE, loadStore, saveStore, STORAGE_KEY, type WorkoutStore };
