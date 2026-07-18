import type { WorkoutStore } from "../data/storage";
import type { Overview } from "../data/workout-session";
import { EXERCISE, EXERCISE_LABELS, type ExerciseName } from "../types";

const EXERCISE_NAMES: ExerciseName[] = [
  EXERCISE.squat,
  EXERCISE.deadlift,
  EXERCISE.ohp,
  EXERCISE.benchpress,
];

const findLastLoggedExercise = (store: WorkoutStore, name: ExerciseName) => {
  for (let i = store.history.length - 1; i >= 0; i--) {
    const exercise = store.history[i].exercises.find((e) => e.name === name);
    if (exercise) {
      return exercise;
    }
  }
  return undefined;
};

const buildOverviewFromStore = (store: WorkoutStore): Overview[] =>
  EXERCISE_NAMES.map((name) => {
    const lastLogged = findLastLoggedExercise(store, name);
    return {
      label: EXERCISE_LABELS[name],
      id: name,
      value: store.workingWeights[name],
      unit: "kg",
      lastSession: lastLogged
        ? {
            exercises: {
              name,
              sets: lastLogged.sets.map((s) => ({
                reps: s.reps,
                weight: s.weight,
              })),
            },
            increase: store.increments[name],
          }
        : undefined,
    };
  });

export { buildOverviewFromStore };
