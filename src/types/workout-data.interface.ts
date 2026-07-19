import type { ExerciseName } from "./exercise.type";

export type ChartData = {
  workout: number;
  date: string;
} & Partial<Record<ExerciseName, number>>;
