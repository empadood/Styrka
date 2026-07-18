import type { WorkoutStore } from "../data/storage";
import type { Overview } from "../data/workout-session";
import {
  EXERCISE,
  EXERCISE_LABELS,
  type ExerciseName,
  type LoggedExercise,
} from "../types";

const EXERCISE_NAMES: ExerciseName[] = [
  EXERCISE.squat,
  EXERCISE.deadlift,
  EXERCISE.ohp,
  EXERCISE.benchpress,
];

const findLastLoggedExercises = (
  store: WorkoutStore,
): Map<ExerciseName, LoggedExercise> => {
  const lastLogged = new Map<ExerciseName, LoggedExercise>();
  for (
    let i = store.history.length - 1;
    i >= 0 && lastLogged.size < EXERCISE_NAMES.length;
    i--
  ) {
    for (const exercise of store.history[i].exercises) {
      if (!lastLogged.has(exercise.name)) {
        lastLogged.set(exercise.name, exercise);
      }
    }
  }
  return lastLogged;
};

const buildOverviewFromStore = (store: WorkoutStore): Overview[] => {
  const lastLoggedByExercise = findLastLoggedExercises(store);

  return EXERCISE_NAMES.map((name) => {
    const lastLogged = lastLoggedByExercise.get(name);
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
};

export { buildOverviewFromStore };
