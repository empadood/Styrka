import type { WorkoutStore } from "../data/storage";
import type { Overview } from "../data/workout-session";
import {
  EXERCISE,
  EXERCISE_LABELS,
  type LoggedExercise,
  type TrackedLiftId,
} from "../types";
import { type RoundingStep, toDisplayWeight, type WeightUnit } from "./weight-unit.helper";

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

const buildOverviewFromStore = (
  store: WorkoutStore,
  unit: WeightUnit,
  roundingStep: RoundingStep,
): Overview[] => {
  const lastLoggedByExercise = findLastLoggedExercises(store);

  return EXERCISE_NAMES.map((name) => {
    const lastLogged = lastLoggedByExercise.get(name);
    return {
      label: EXERCISE_LABELS[name],
      id: name,
      value: toDisplayWeight(store.workingWeights[name], unit, roundingStep),
      unit,
      lastSession: lastLogged
        ? {
            exercises: {
              name,
              sets: lastLogged.sets.map((s) => ({
                reps: s.reps,
                weight: toDisplayWeight(s.weight, unit, roundingStep),
              })),
            },
            increase: toDisplayWeight(store.increments[name], unit, roundingStep),
          }
        : undefined,
    };
  });
};

export { buildOverviewFromStore, findLastLoggedExercises };
