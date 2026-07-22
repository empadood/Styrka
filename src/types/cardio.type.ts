const CARDIO_ACTIVITY = {
  treadmill: "treadmill",
  rowing: "rowing",
  stairmaster: "stairmaster",
  cycling: "cycling",
  elliptical: "elliptical",
  other: "other",
} as const;

type CardioActivityId = (typeof CARDIO_ACTIVITY)[keyof typeof CARDIO_ACTIVITY];

const CARDIO_ACTIVITY_LABELS: Record<CardioActivityId, string> = {
  treadmill: "Treadmill",
  rowing: "Rowing",
  stairmaster: "Stairmaster",
  cycling: "Cycling",
  elliptical: "Elliptical",
  other: "Other",
};

interface LoggedCardioSession {
  id: string;
  activityId: CardioActivityId;
  label: string;
  durationSeconds: number;
  kcal: number;
  isRunning: boolean;
  startedAt: string | null;
  isFinished: boolean;
  isSaved: boolean;
}

export {
  CARDIO_ACTIVITY,
  CARDIO_ACTIVITY_LABELS,
  type CardioActivityId,
  type LoggedCardioSession,
};
