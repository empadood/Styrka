import { getExerciseWeight } from "./trends.helper";
import type { WorkoutHistoryEntry } from "../types";

type TrainingStatus = "comeback" | "gaining" | "maintaining" | "declining";

type Trend = "up" | "down" | "flat";
type RpeTrend = Trend | "unknown";

const average = (values: number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const getSessionWeightScore = (session: WorkoutHistoryEntry): number =>
  average(session.exercises.map(getExerciseWeight));

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

const computeTrainingStatus = (
  history: WorkoutHistoryEntry[],
  now: Date = new Date(),
  windowDays = 30,
): TrainingStatus | "insufficient-data" => {
  const windowStart = now.getTime() - windowDays * 24 * 60 * 60 * 1000;
  const sessions = history
    .filter((session) => new Date(session.date).getTime() >= windowStart)
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

  if (sessions.length < 2) {
    return "insufficient-data";
  }

  const weightScores = sessions.map(getSessionWeightScore);
  const midpoint = Math.ceil(sessions.length / 2);
  const earlyWeightAvg = average(weightScores.slice(0, midpoint));
  const lateWeightAvg = average(weightScores.slice(midpoint));
  const weightTrend = classifyWeightTrend(earlyWeightAvg, lateWeightAvg);

  const rpeSessions = sessions
    .map((session, index) => ({ rpe: session.checkIn?.rpe, index }))
    .filter(
      (entry): entry is { rpe: number; index: number } =>
        entry.rpe !== undefined,
    );
  const rpeMidpoint = Math.ceil(rpeSessions.length / 2);
  const rpeTrend: RpeTrend =
    rpeSessions.length < 2
      ? "unknown"
      : classifyRpeTrend(
          average(rpeSessions.slice(0, rpeMidpoint).map((s) => s.rpe)),
          average(rpeSessions.slice(rpeMidpoint).map((s) => s.rpe)),
        );

  const firstScore = weightScores[0];
  const lastScore = weightScores[weightScores.length - 1];
  const minScore = Math.min(...weightScores);
  const dip = minScore < firstScore * 0.98 && lastScore >= firstScore;

  if (weightTrend === "down") {
    return "declining";
  }
  if (weightTrend === "flat" && rpeTrend === "up") {
    return "declining";
  }
  if (weightTrend === "up" && dip) {
    return "comeback";
  }
  if (weightTrend === "up") {
    return "gaining";
  }
  return "maintaining";
};

export { computeTrainingStatus, type TrainingStatus };
