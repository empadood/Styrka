import type { TrackedLiftId } from "./exercise.type";

export type ChartData = {
  workout: number;
  date: string;
} & Partial<Record<TrackedLiftId, number>>;
