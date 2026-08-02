import type {
  ExerciseCatalogEntry,
  ExerciseId,
  LoggedExercise,
  TrackedLiftId,
  WorkoutHistoryEntry,
} from "../types";
import type { ProgramExercisePrescription, ProgramSession } from "../types/program.type";
import { findCatalogEntry, getLastLoggedWeight } from "./exercise-catalog.helper";

const buildLoggedExerciseFromPrescription = (
  prescription: ProgramExercisePrescription,
  catalog: ExerciseCatalogEntry[],
  workingWeights: Record<TrackedLiftId, number>,
  history: WorkoutHistoryEntry[],
  sourceLabel?: string,
): LoggedExercise => {
  const catalogEntry = findCatalogEntry(catalog, prescription.exerciseId);
  const tracked = catalogEntry?.tracked ?? false;
  const defaultWeight = tracked
    ? workingWeights[prescription.exerciseId as TrackedLiftId]
    : getLastLoggedWeight(history, prescription.exerciseId) ?? 0;

  return {
    exerciseId: prescription.exerciseId,
    label: prescription.label,
    tracked,
    isAdHoc: false,
    weightUsed: defaultWeight,
    completed: false,
    showWeightIndicator: prescription.showWeightIndicator ?? tracked,
    showWarmupSets: prescription.showWarmupSets ?? true,
    sourceLabel,
    sets: Array.from({ length: prescription.sets }, () => ({
      targetReps: prescription.reps,
      reps: 0,
      weight: defaultWeight,
    })),
  };
};

const buildInitialExercises = (
  session: ProgramSession | null,
  catalog: ExerciseCatalogEntry[],
  workingWeights: Record<TrackedLiftId, number>,
  history: WorkoutHistoryEntry[],
  sourceLabel?: string,
): LoggedExercise[] =>
  session
    ? session.exercises.map((prescription) =>
        buildLoggedExerciseFromPrescription(
          prescription,
          catalog,
          workingWeights,
          history,
          sourceLabel,
        ),
      )
    : [];

const buildAdHocLoggedExercise = (
  exerciseId: ExerciseId,
  label: string,
  tracked: boolean,
  sets: number,
  reps: number,
  defaultWeight: number,
  showWeightIndicator: boolean,
  showWarmupSets: boolean,
): LoggedExercise => ({
  exerciseId,
  label,
  tracked,
  isAdHoc: true,
  weightUsed: defaultWeight,
  completed: false,
  showWeightIndicator,
  showWarmupSets,
  sets: Array.from({ length: sets }, () => ({
    targetReps: reps,
    reps: 0,
    weight: defaultWeight,
  })),
});

export {
  buildAdHocLoggedExercise,
  buildInitialExercises,
  buildLoggedExerciseFromPrescription,
};
