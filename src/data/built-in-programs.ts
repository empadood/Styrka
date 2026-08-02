import { EXERCISE, EXERCISE_LABELS } from "../types/exercise.type";
import type { Program } from "../types/program.type";

export const STARTING_STRENGTH_PROGRAM_ID = "builtin-starting-strength-5x5";

export const STARTING_STRENGTH_PROGRAM: Program = {
  id: STARTING_STRENGTH_PROGRAM_ID,
  name: " Foundation Strength 3x5",
  description: "Classic barbell A/B linear-progression split.",
  isBuiltIn: true,
  createdAt: "2024-01-01T00:00:00.000Z",
  type: "main",
  sessions: [
    {
      id: "A",
      name: "Session A",
      exercises: [
        {
          exerciseId: EXERCISE.squat,
          label: EXERCISE_LABELS.squat,
          sets: 3,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
        {
          exerciseId: EXERCISE.deadlift,
          label: EXERCISE_LABELS.deadlift,
          sets: 1,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
        {
          exerciseId: EXERCISE.ohp,
          label: EXERCISE_LABELS.ohp,
          sets: 3,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
      ],
    },
    {
      id: "B",
      name: "Session B",
      exercises: [
        {
          exerciseId: EXERCISE.squat,
          label: EXERCISE_LABELS.squat,
          sets: 3,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
        {
          exerciseId: EXERCISE.deadlift,
          label: EXERCISE_LABELS.deadlift,
          sets: 1,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
        {
          exerciseId: EXERCISE.benchpress,
          label: EXERCISE_LABELS.benchpress,
          sets: 3,
          reps: 5,
          showWeightIndicator: true,
          showWarmupSets: true,
        },
      ],
    },
  ],
};

export const BUILT_IN_PROGRAMS: Program[] = [STARTING_STRENGTH_PROGRAM];
