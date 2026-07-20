import type { BodyWeightEntry } from "../types";

const toCalendarDate = (date: string): string => date.slice(0, 10);

const upsertBodyWeightEntry = (
  log: BodyWeightEntry[],
  date: string,
  weight: number,
): BodyWeightEntry[] => {
  const day = toCalendarDate(date);
  const withoutSameDay = log.filter(
    (entry) => toCalendarDate(entry.date) !== day,
  );

  return [...withoutSameDay, { id: crypto.randomUUID(), date, weight }].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
};

const buildBodyWeightTrendData = (
  log: BodyWeightEntry[],
): { date: string; weight: number }[] =>
  [...log]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({ date: entry.date, weight: entry.weight }));

const getLatestBodyWeight = (log: BodyWeightEntry[]): number | null => {
  if (log.length === 0) {
    return null;
  }

  return [...log].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0].weight;
};

export {
  buildBodyWeightTrendData,
  getLatestBodyWeight,
  upsertBodyWeightEntry,
};
