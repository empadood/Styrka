import { useState } from "react";

type WarmupEntry = { reps: number; weight: number };

const warmupKey = (exerciseIndex: number, warmupIndex: number) =>
  `${exerciseIndex}-${warmupIndex}`;

export const useWarmupEntries = () => {
  const [entries, setEntries] = useState<Record<string, WarmupEntry>>({});

  const getEntry = (
    exerciseIndex: number,
    warmupIndex: number,
    defaultWeight: number,
  ): WarmupEntry => entries[warmupKey(exerciseIndex, warmupIndex)] ?? { reps: 0, weight: defaultWeight };

  const updateEntry = (
    exerciseIndex: number,
    warmupIndex: number,
    field: keyof WarmupEntry,
    value: number,
    defaultWeight: number,
  ) => {
    const key = warmupKey(exerciseIndex, warmupIndex);
    setEntries((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { reps: 0, weight: defaultWeight }), [field]: value },
    }));
  };

  return { getEntry, updateEntry };
};
