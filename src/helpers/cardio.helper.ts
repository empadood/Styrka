import type { LoggedCardioSession } from "../types";

const getElapsedSeconds = (entry: LoggedCardioSession, now: number): number => {
  if (!entry.isRunning || !entry.startedAt) {
    return entry.durationSeconds;
  }
  const runningFor = (now - new Date(entry.startedAt).getTime()) / 1000;
  return entry.durationSeconds + Math.max(0, runningFor);
};

const formatDuration = (totalSeconds: number): string => {
  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (value: number) => value.toString().padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${pad(minutes)}:${pad(secs)}`;
};

const totalCardioKcal = (cardio: LoggedCardioSession[]): number =>
  cardio.reduce((sum, entry) => sum + entry.kcal, 0);

export { formatDuration, getElapsedSeconds, totalCardioKcal };
