const EXERCISE = {
  benchpress: "benchpress",
  squat: "squat",
  deadlift: "deadlift",
  ohp: "ohp",
} as const;

type TrackedLiftId = (typeof EXERCISE)[keyof typeof EXERCISE];

const EXERCISE_LABELS: Record<TrackedLiftId, string> = {
  benchpress: "Bench Press",
  deadlift: "Deadlift",
  ohp: "Overhead press",
  squat: "Squat",
};

export { EXERCISE, EXERCISE_LABELS, type TrackedLiftId };
