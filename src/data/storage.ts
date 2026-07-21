import type {
  BodyWeightEntry,
  ExerciseCatalogEntry,
  LoggedExercise,
  Program,
  TrackedLiftId,
  WorkoutHistoryEntry,
} from "../types";
import { STARTING_STRENGTH_PROGRAM } from "./built-in-programs";
import {
  mergeBuiltInPrograms,
  migrateLegacyActiveWorkout,
  migrateLegacyHistoryEntry,
  resolveActiveProgramId,
  resolveLastCompletedSessionId,
} from "./migrations";

const STORAGE_KEY = "styrka.workout-store.v1";

interface ActiveWorkout {
  programId: string | null;
  sessionId: string | null;
  sessionLabel: string;
  exercises: LoggedExercise[];
}

interface WorkoutStore {
  workingWeights: Record<TrackedLiftId, number>;
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
  hasConfiguredOneRepMax: boolean;
  increments: Record<TrackedLiftId, number>;
  programs: Program[];
  activeProgramId: string | null;
  lastCompletedSessionId: string | null;
  customExerciseCatalog: ExerciseCatalogEntry[];
  history: WorkoutHistoryEntry[];
  activeWorkout: ActiveWorkout | null;
  bodyWeightLog: BodyWeightEntry[];
  updatedAt: string;
}

const DEFAULT_STORE: WorkoutStore = {
  workingWeights: { squat: 20, deadlift: 40, ohp: 20, benchpress: 20 },
  estimatedOneRepMax: null,
  hasConfiguredOneRepMax: false,
  increments: { squat: 5, deadlift: 5, ohp: 2.5, benchpress: 2.5 },
  programs: [STARTING_STRENGTH_PROGRAM],
  activeProgramId: STARTING_STRENGTH_PROGRAM.id,
  lastCompletedSessionId: null,
  customExerciseCatalog: [],
  history: [],
  activeWorkout: null,
  bodyWeightLog: [],
  updatedAt: new Date(0).toISOString(),
};

const parseStore = (raw: string | null): WorkoutStore => {
  if (!raw) {
    return DEFAULT_STORE;
  }

  try {
    const parsed = JSON.parse(raw);
    const programs = mergeBuiltInPrograms(parsed.programs);
    const history = Array.isArray(parsed.history)
      ? parsed.history.map(migrateLegacyHistoryEntry)
      : [];

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
      programs,
      activeProgramId: resolveActiveProgramId(parsed, programs),
      lastCompletedSessionId: resolveLastCompletedSessionId(parsed),
      customExerciseCatalog: Array.isArray(parsed.customExerciseCatalog)
        ? parsed.customExerciseCatalog
        : [],
      history,
      activeWorkout: migrateLegacyActiveWorkout(parsed.activeWorkout ?? null),
      bodyWeightLog: Array.isArray(parsed.bodyWeightLog)
        ? parsed.bodyWeightLog
        : [],
      updatedAt:
        typeof parsed.updatedAt === "string"
          ? parsed.updatedAt
          : DEFAULT_STORE.updatedAt,
    };
  } catch {
    return DEFAULT_STORE;
  }
};

const loadStore = (): WorkoutStore => parseStore(localStorage.getItem(STORAGE_KEY));

const saveStore = (store: WorkoutStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export {
  type ActiveWorkout,
  DEFAULT_STORE,
  loadStore,
  parseStore,
  saveStore,
  STORAGE_KEY,
  type WorkoutStore,
};
