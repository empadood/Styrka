import type { WorkoutHistoryEntry } from "../types";
import { getExerciseWeight } from "./trends.helper";

type TrainingStatus = "comeback" | "gaining" | "maintaining" | "declining";

type Trend = "up" | "down" | "flat";
type RpeTrend = Trend | "unknown";

type TrainingStatusDetails = {
  status: TrainingStatus | "insufficient-data";
  windowDays: number;
  sessionCount: number;
  earlyWeightAvg: number | null;
  lateWeightAvg: number | null;
  weightChangePercent: number | null;
  weightTrend: Trend | null;
  earlyRpeAvg: number | null;
  lateRpeAvg: number | null;
  rpeTrend: RpeTrend | null;
  dipDetected: boolean;
};

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const getSessionWeightScore = (session: WorkoutHistoryEntry): number | null => {
  const trackedExercises = session.exercises.filter((exercise) => exercise.tracked);
  return trackedExercises.length === 0 ? null : average(trackedExercises.map(getExerciseWeight));
};

const classifyWeightTrend = (early: number, late: number): Trend => {
  if (late > early * 1.015) {
    return "up";
  }
  if (late < early * 0.985) {
    return "down";
  }
  return "flat";
};

const classifyRpeTrend = (early: number, late: number): Trend => {
  if (late - early > 0.5) {
    return "up";
  }
  if (late - early < -0.5) {
    return "down";
  }
  return "flat";
};

const getTrainingStatusDetails = (
  history: WorkoutHistoryEntry[],
  now: Date = new Date(),
  windowDays = 30,
): TrainingStatusDetails => {
  const windowStart = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  const sessions = history
    .filter((session) => new Date(session.date).getTime() >= windowStart)
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  if (sessions.length < 2) {
    return {
      status: "insufficient-data",
      windowDays,
      sessionCount: sessions.length,
      earlyWeightAvg: null,
      lateWeightAvg: null,
      weightChangePercent: null,
      weightTrend: null,
      earlyRpeAvg: null,
      lateRpeAvg: null,
      rpeTrend: null,
      dipDetected: false,
    };
  }

  const weightScores = sessions
    .map(getSessionWeightScore)
    .filter((score): score is number => score !== null);

  let earlyWeightAvg: number | null = null;
  let lateWeightAvg: number | null = null;
  let weightChangePercent: number | null = null;
  let weightTrend: Trend | null = null;
  if (weightScores.length >= 2) {
    const midpoint = Math.ceil(weightScores.length / 2);
    earlyWeightAvg = average(weightScores.slice(0, midpoint));
    lateWeightAvg = average(weightScores.slice(midpoint));
    weightTrend = classifyWeightTrend(earlyWeightAvg, lateWeightAvg);
    weightChangePercent = ((lateWeightAvg - earlyWeightAvg) / earlyWeightAvg) * 100;
  }

  const rpeSessions = sessions
    .map((session, index) => ({ rpe: session.checkIn?.rpe, index }))
    .filter(
      (entry): entry is { rpe: number; index: number } =>
        entry.rpe !== undefined,
    );
  const rpeMidpoint = Math.ceil(rpeSessions.length / 2);
  const earlyRpeAvg =
    rpeSessions.length < 2 ? null : average(rpeSessions.slice(0, rpeMidpoint).map((s) => s.rpe));
  const lateRpeAvg =
    rpeSessions.length < 2 ? null : average(rpeSessions.slice(rpeMidpoint).map((s) => s.rpe));
  const rpeTrend: RpeTrend =
    earlyRpeAvg === null || lateRpeAvg === null
      ? "unknown"
      : classifyRpeTrend(earlyRpeAvg, lateRpeAvg);

  const firstScore = weightScores[0];
  const lastScore = weightScores[weightScores.length - 1];
  const dipDetected =
    weightScores.length >= 2 &&
    Math.min(...weightScores) < firstScore * 0.98 &&
    lastScore >= firstScore;

  let status: TrainingStatus;
  if (weightTrend === "down") {
    status = "declining";
  } else if ((weightTrend === "flat" || weightTrend === null) && rpeTrend === "up") {
    status = "declining";
  } else if (weightTrend === "up" && dipDetected) {
    status = "comeback";
  } else if (weightTrend === "up") {
    status = "gaining";
  } else {
    status = "maintaining";
  }

  return {
    status,
    windowDays,
    sessionCount: sessions.length,
    earlyWeightAvg,
    lateWeightAvg,
    weightChangePercent,
    weightTrend,
    earlyRpeAvg,
    lateRpeAvg,
    rpeTrend,
    dipDetected,
  };
};

const computeTrainingStatus = (
  history: WorkoutHistoryEntry[],
  now: Date = new Date(),
  windowDays = 30,
): TrainingStatus | "insufficient-data" =>
  getTrainingStatusDetails(history, now, windowDays).status;

export {
  computeTrainingStatus,
  getTrainingStatusDetails,
  type TrainingStatus,
  type TrainingStatusDetails,
};
