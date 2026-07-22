import type { BodyWeightEntry } from "../types";

const toCalendarDate = (date: string): string => date.slice(0, 10);

const upsertBodyWeightEntry = (
  log: BodyWeightEntry[],
  date: string,
  weight: number,
  bodyFatPercent?: number,
): BodyWeightEntry[] => {
  const day = toCalendarDate(date);
  const withoutSameDay = log.filter(
    (entry) => toCalendarDate(entry.date) !== day,
  );

  return [
    ...withoutSameDay,
    { id: crypto.randomUUID(), date, weight, bodyFatPercent },
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const buildBodyWeightTrendData = (
  log: BodyWeightEntry[],
): { date: string; weight: number; bodyFatPercent?: number }[] =>
  [...log]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      weight: entry.weight,
      bodyFatPercent: entry.bodyFatPercent,
    }));

const getLatestBodyWeight = (log: BodyWeightEntry[]): number | null => {
  if (log.length === 0) {
    return null;
  }

  return [...log].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0].weight;
};

const getBodyWeightChartDomain = (
  log: BodyWeightEntry[],
): [number, number] | undefined => {
  if (log.length === 0) {
    return undefined;
  }

  const weights = log.map((entry) => entry.weight);

  return [
    Math.round(Math.min(...weights) - 10),
    Math.round(Math.max(...weights) + 10),
  ];
};

export {
  buildBodyWeightTrendData,
  getBodyWeightChartDomain,
  getLatestBodyWeight,
  upsertBodyWeightEntry,
};
