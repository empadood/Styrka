import { EXERCISE, type SessionDefinition } from "../types";

export const SESSION_DEFINITION: SessionDefinition = {
  A: [
    { name: EXERCISE.squat, sets: 3, reps: 5 },
    { name: EXERCISE.deadlift, sets: 1, reps: 5 },
    { name: EXERCISE.ohp, sets: 3, reps: 5 },
  ],
  B: [
    { name: EXERCISE.squat, sets: 3, reps: 5 },
    { name: EXERCISE.deadlift, sets: 1, reps: 5 },
    { name: EXERCISE.benchpress, sets: 3, reps: 5 },
  ],
};
