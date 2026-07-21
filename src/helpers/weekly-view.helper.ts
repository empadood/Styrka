import type { WorkoutHistoryEntry } from "../types";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type WeekDay = {
  date: string;
  weekdayLabel: string;
  hasSession: boolean;
  sessionLabel?: string;
};

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isSameCalendarDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getCurrentWeekStart = (referenceDate: Date): Date => {
  const today = startOfDay(referenceDate);
  const isoWeekday = today.getDay() === 0 ? 7 : today.getDay(); // Mon=1..Sun=7
  return addDays(today, -(isoWeekday - 1));
};

const buildWeekDays = (
  history: WorkoutHistoryEntry[],
  referenceDate: Date = new Date(),
): WeekDay[] => {
  const weekStart = getCurrentWeekStart(referenceDate);

  return WEEKDAY_LABELS.map((weekdayLabel, index) => {
    const date = addDays(weekStart, index);
    const match = history.find((entry) => isSameCalendarDay(new Date(entry.date), date));

    return {
      date: date.toISOString(),
      weekdayLabel,
      hasSession: Boolean(match),
      sessionLabel: match?.sessionLabel,
    };
  });
};

export { buildWeekDays, type WeekDay };
