const EXERCISE = {
  benchpress: "benchpress",
  squat: "squat",
  deadlift: "deadlift",
  ohp: "ohp",
} as const;

type ExerciseName = (typeof EXERCISE)[keyof typeof EXERCISE];

const EXERCISE_LABELS: Record<ExerciseName, string> = {
  benchpress: "Bench Press",
  deadlift: "Deadlift",
  ohp: "Overhead press",
  squat: "Squat",
};

export { EXERCISE, EXERCISE_LABELS, type ExerciseName };
