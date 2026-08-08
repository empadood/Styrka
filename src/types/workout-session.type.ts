import type { LoggedCardioSession } from "./cardio.type";
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
  showWeightIndicator: boolean;
  showWarmupSets: boolean;
  isBodyweight: boolean;
  sourceLabel?: string;
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
  subProgramId: string | null;
  subSessionId: string | null;
  sessionLabel: string;
  exercises: LoggedExercise[];
  cardio: LoggedCardioSession[];
  checkIn?: SessionCheckIn;
}

export type {
  LoggedExercise,
  LoggedSet,
  SessionCheckIn,
  WorkoutHistoryEntry,
};
