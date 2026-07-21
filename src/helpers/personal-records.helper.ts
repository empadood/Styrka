import type { ExerciseId, WorkoutHistoryEntry } from "../types";
import { calculateOneRepMax } from "./one-rep-max.helper";

interface PersonalRecord {
  exerciseId: ExerciseId;
  label: string;
  oneRepMax: number;
  date: string;
  sessionId: string;
  weight: number;
  reps: number;
}

const findPersonalRecords = (
  history: WorkoutHistoryEntry[],
): Map<ExerciseId, PersonalRecord> => {
  const best = new Map<ExerciseId, PersonalRecord>();

  for (const entry of history) {
    for (const exercise of entry.exercises) {
      for (const set of exercise.sets) {
        if (set.reps <= 0) {
          continue;
        }
        const oneRepMax = calculateOneRepMax(set.weight, set.reps);
        const current = best.get(exercise.exerciseId);
        if (!current || oneRepMax > current.oneRepMax) {
          best.set(exercise.exerciseId, {
            exerciseId: exercise.exerciseId,
            label: exercise.label,
            oneRepMax,
            date: entry.date,
            sessionId: entry.id,
            weight: set.weight,
            reps: set.reps,
          });
        }
      }
    }
  }

  return best;
};

const isPersonalRecordSet = (
  personalRecords: Map<ExerciseId, PersonalRecord>,
  entry: WorkoutHistoryEntry,
  exerciseId: ExerciseId,
  weight: number,
  reps: number,
): boolean => {
  const record = personalRecords.get(exerciseId);
  return (
    record !== undefined &&
    record.sessionId === entry.id &&
    record.weight === weight &&
    record.reps === reps
  );
};

export { findPersonalRecords, isPersonalRecordSet, type PersonalRecord };
