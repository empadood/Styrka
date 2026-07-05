import { EXERCISE, EXERCISE_LABELS, type ExerciseName } from "../types";

interface WorkingSet {
  reps: number;
  weight: number;
}
interface Session {
  exercises: {
    name: string;
    sets: WorkingSet[];
  };
  increase: number;
}

interface Overview {
  label: string;
  id: ExerciseName;
  value: number;
  unit: "kg";
  lastSession?: Session;
}
export type { Overview, Session, WorkingSet };
const items: Overview[] = [
  {
    label: EXERCISE_LABELS[EXERCISE.ohp],
    id: EXERCISE.ohp,
    unit: "kg",
    value: 56,
    lastSession: {
      increase: 2.5,
      exercises: {
        name: "Press",
        sets: [
          {
            reps: 5,
            weight: 50,
          },
          {
            reps: 5,
            weight: 50,
          },
          {
            reps: 5,
            weight: 50,
          },
        ],
      },
    },
  },
  {
    label: EXERCISE_LABELS[EXERCISE.squat],
    id: EXERCISE.squat,
    unit: "kg",
    value: 85,
    lastSession: {
      increase: 5,
      exercises: {
        name: "Press",
        sets: [
          {
            reps: 5,
            weight: 85,
          },
          {
            reps: 5,
            weight: 85,
          },
          {
            reps: 5,
            weight: 85,
          },
        ],
      },
    },
  },

  {
    label: EXERCISE_LABELS[EXERCISE.benchpress],
    id: EXERCISE.benchpress,
    unit: "kg",
    value: 68,
    lastSession: {
      increase: 2.5,
      exercises: {
        name: "Press",
        sets: [
          {
            reps: 5,
            weight: 65,
          },
          {
            reps: 5,
            weight: 65,
          },
          {
            reps: 5,
            weight: 65,
          },
        ],
      },
    },
  },

  {
    label: EXERCISE_LABELS[EXERCISE.deadlift],
    id: EXERCISE.deadlift,
    unit: "kg",
    value: 115,
    lastSession: {
      increase: 5,
      exercises: {
        name: "Press",
        sets: [
          {
            reps: 5,
            weight: 115,
          },
        ],
      },
    },
  },
];

const workoutA: ExerciseName[] = [
  EXERCISE.squat,
  EXERCISE.deadlift,
  EXERCISE.ohp,
];
const workoutB: ExerciseName[] = [
  EXERCISE.squat,
  EXERCISE.deadlift,
  EXERCISE.benchpress,
];

export { items, workoutA, workoutB };
