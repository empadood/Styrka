import type { WorkoutStore } from "../data/storage";
import type { Overview } from "../data/workout-session";
import {
  EXERCISE,
  EXERCISE_LABELS,
  type LoggedExercise,
  type TrackedLiftId,
} from "../types";

const EXERCISE_NAMES: TrackedLiftId[] = [
  EXERCISE.squat,
  EXERCISE.deadlift,
  EXERCISE.ohp,
  EXERCISE.benchpress,
];

const findLastLoggedExercises = (
  store: WorkoutStore,
): Map<string, LoggedExercise> => {
  const lastLogged = new Map<string, LoggedExercise>();
  for (
    let i = store.history.length - 1;
    i >= 0 && lastLogged.size < EXERCISE_NAMES.length;
    i--
  ) {
    for (const exercise of store.history[i].exercises) {
      if (!lastLogged.has(exercise.exerciseId)) {
        lastLogged.set(exercise.exerciseId, exercise);
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
      unit: "kg" as const,
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

export { buildOverviewFromStore, findLastLoggedExercises };
