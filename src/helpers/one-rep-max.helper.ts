import type { WorkoutStore } from "../data/storage";
import type { ExerciseId, LoggedExercise, LoggedSet } from "../types";
import { findLastLoggedExercises } from "./overview.helper";

// Brzycki formula: 1RM = weight * (36 / (37 - reps))
const calculateOneRepMax = (weight: number, reps: number): number => {
  const clampedReps = Math.min(Math.max(reps, 0), 36);
  return weight * (36 / (37 - clampedReps));
};

// Uses whichever logged set (with reps > 0) yields the highest estimate;
// returns null when no reps were logged for the exercise.
const calculateBestOneRepMax = (sets: LoggedSet[]): number | null => {
  const validSets = sets.filter((set) => set.reps > 0);
  if (validSets.length === 0) {
    return null;
  }
  return Math.max(
    ...validSets.map((set) => calculateOneRepMax(set.weight, set.reps)),
  );
};

interface OneRepMaxResult {
  exerciseId: ExerciseId;
  label: string;
  oneRepMax: number | null;
  previousOneRepMax: number | null;
  difference: number | null;
}

// `store` should reflect state *before* this session is saved to history,
// so the previously logged exercise is the last completed session's data.
const calculateSessionOneRepMax = (
  exercises: LoggedExercise[],
  store: WorkoutStore,
): OneRepMaxResult[] => {
  const previousByExercise = findLastLoggedExercises(store);

  return exercises.map((exercise) => {
    const oneRepMax = calculateBestOneRepMax(exercise.sets);
    const previousExercise = previousByExercise.get(exercise.exerciseId);
    const previousOneRepMax = previousExercise
      ? calculateBestOneRepMax(previousExercise.sets)
      : null;
    const difference =
      oneRepMax !== null && previousOneRepMax !== null
        ? oneRepMax - previousOneRepMax
        : null;

    return {
      exerciseId: exercise.exerciseId,
      label: exercise.label,
      oneRepMax,
      previousOneRepMax,
      difference,
    };
  });
};

export {
  calculateBestOneRepMax,
  calculateOneRepMax,
  calculateSessionOneRepMax,
  type OneRepMaxResult,
};
