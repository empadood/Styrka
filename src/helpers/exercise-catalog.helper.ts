import { BUILT_IN_EXERCISE_CATALOG } from "../data/exercise-catalog";
import type { WorkoutStore } from "../data/storage";
import type {
  ExerciseCatalogEntry,
  ExerciseId,
  WorkoutHistoryEntry,
} from "../types";

const getCombinedCatalog = (store: WorkoutStore): ExerciseCatalogEntry[] => [
  ...BUILT_IN_EXERCISE_CATALOG,
  ...store.customExerciseCatalog,
];

const findCatalogEntry = (
  catalog: ExerciseCatalogEntry[],
  id: ExerciseId,
): ExerciseCatalogEntry | undefined =>
  catalog.find((entry) => entry.id === id);

const slugify = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const resolveCustomExercise = (
  catalog: ExerciseCatalogEntry[],
  rawName: string,
): ExerciseCatalogEntry => {
  const trimmed = rawName.trim();
  const existing = catalog.find(
    (entry) => entry.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (existing) {
    return existing;
  }

  return {
    id: `custom-${slugify(trimmed)}-${crypto.randomUUID().slice(0, 6)}`,
    label: trimmed,
    tracked: false,
    custom: true,
  };
};

type ExerciseSelectionInput = {
  exerciseId?: ExerciseId;
  customName?: string;
};

const resolveExerciseSelection = (
  catalog: ExerciseCatalogEntry[],
  input: ExerciseSelectionInput,
  onRegisterCustomExercise: (entry: ExerciseCatalogEntry) => void,
): ExerciseCatalogEntry | undefined => {
  const entry = input.exerciseId
    ? findCatalogEntry(catalog, input.exerciseId)
    : resolveCustomExercise(catalog, input.customName ?? "");

  if (!entry) {
    return undefined;
  }

  if (entry.custom && !catalog.some((c) => c.id === entry.id)) {
    onRegisterCustomExercise(entry);
  }

  return entry;
};

const getLastLoggedWeight = (
  history: WorkoutHistoryEntry[],
  exerciseId: ExerciseId,
): number | null => {
  for (let i = history.length - 1; i >= 0; i--) {
    const match = history[i].exercises.find(
      (exercise) => exercise.exerciseId === exerciseId,
    );
    if (match) {
      return Math.max(match.weightUsed, ...match.sets.map((set) => set.weight));
    }
  }
  return null;
};

export {
  findCatalogEntry,
  getCombinedCatalog,
  getLastLoggedWeight,
  resolveCustomExercise,
  resolveExerciseSelection,
  slugify,
};
