import type { ExerciseName } from "./exercise.type";

export type ChartData = {
  workout: number;
} & Partial<Record<ExerciseName, number>>;
