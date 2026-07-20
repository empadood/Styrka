import { EXERCISE, EXERCISE_LABELS } from "../types/exercise.type";
import type { ExerciseCatalogEntry } from "../types/exercise-catalog.type";

export const BUILT_IN_EXERCISE_CATALOG: ExerciseCatalogEntry[] = [
  { id: EXERCISE.squat, label: EXERCISE_LABELS.squat, tracked: true },
  { id: EXERCISE.deadlift, label: EXERCISE_LABELS.deadlift, tracked: true },
  { id: EXERCISE.ohp, label: EXERCISE_LABELS.ohp, tracked: true },
  { id: EXERCISE.benchpress, label: EXERCISE_LABELS.benchpress, tracked: true },
  { id: "barbell-row", label: "Barbell Row", tracked: false },
  { id: "pullup", label: "Pull-up / Lat Pulldown", tracked: false },
  { id: "lunge", label: "Lunge", tracked: false },
  { id: "bicep-curl", label: "Bicep Curl", tracked: false },
  { id: "triceps-extension", label: "Triceps Extension", tracked: false },
  { id: "lateral-raise", label: "Lateral Raise", tracked: false },
  { id: "leg-press", label: "Leg Press", tracked: false },
  { id: "leg-curl", label: "Leg Curl", tracked: false },
  { id: "chest-fly", label: "Chest Fly", tracked: false },
  { id: "face-pull", label: "Face Pull", tracked: false },
  { id: "plank", label: "Plank", tracked: false },
];
