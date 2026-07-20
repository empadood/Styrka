type ExerciseId = string;

interface ExerciseCatalogEntry {
  id: ExerciseId;
  label: string;
  tracked: boolean;
  custom?: boolean;
}

export type { ExerciseCatalogEntry, ExerciseId };
