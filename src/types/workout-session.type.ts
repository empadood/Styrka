import type { ExerciseId } from "./exercise-catalog.type";

interface LoggedSet {
  targetReps: number;
  reps: number;
  weight: number;
}

interface LoggedExercise {
  exerciseId: ExerciseId;
  label: string;
  tracked: boolean;
  isAdHoc: boolean;
  sets: LoggedSet[];
  completed: boolean;
  weightUsed: number;
}

interface SessionCheckIn {
  rpe: number;
  notes: string;
}

interface WorkoutHistoryEntry {
  id: string;
  date: string;
  programId: string | null;
  sessionId: string | null;
  sessionLabel: string;
  exercises: LoggedExercise[];
  checkIn?: SessionCheckIn;
}

export type {
  LoggedExercise,
  LoggedSet,
  SessionCheckIn,
  WorkoutHistoryEntry,
};
