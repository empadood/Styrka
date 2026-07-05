import { EXERCISE, EXERCISE_LABELS } from "../types";

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
  value: number;
  unit: "kg";
  lastSession?: Session;
}
export type { Overview,Session, WorkingSet };
export const items: Overview[] = [
  {
    label: EXERCISE_LABELS[EXERCISE.ohp],
    unit: "kg",
    value: 56,
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
    label: EXERCISE_LABELS[EXERCISE.squat],
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
          {
            reps: 5,
            weight: 115,
          },
          {
            reps: 5,
            weight: 115,
          },
        ],
      },
    },
  },
];
