import { getElapsedSeconds } from "../helpers/cardio.helper";
import type { LoggedCardioSession } from "../types";

type OnChange = (cardio: LoggedCardioSession[]) => void;

export const useCardioTimer = (cardio: LoggedCardioSession[], onChange: OnChange) => {
  const start = (id: string) => {
    onChange(
      cardio.map((entry) =>
        entry.id === id && !entry.isRunning
          ? { ...entry, isRunning: true, startedAt: new Date().toISOString() }
          : entry,
      ),
    );
  };

  const pause = (id: string) => {
    const now = Date.now();
    onChange(
      cardio.map((entry) =>
        entry.id === id && entry.isRunning
          ? {
              ...entry,
              isRunning: false,
              startedAt: null,
              durationSeconds: getElapsedSeconds(entry, now),
            }
          : entry,
      ),
    );
  };

  const setKcal = (id: string, kcal: number) => {
    onChange(cardio.map((entry) => (entry.id === id ? { ...entry, kcal } : entry)));
  };

  const remove = (id: string) => {
    onChange(cardio.filter((entry) => entry.id !== id));
  };

  return {
    elapsedSeconds: (entry: LoggedCardioSession) => getElapsedSeconds(entry, Date.now()),
    start,
    pause,
    setKcal,
    remove,
  };
};
