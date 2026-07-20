import type { ExerciseName } from "./exercise.type";

type SessionType = "A" | "B";

interface ExercisePrescription {
  name: ExerciseName;
  sets: number;
  reps: number;
}

type SessionDefinition = Record<SessionType, ExercisePrescription[]>;

interface LoggedSet {
  targetReps: number;
  reps: number;
  weight: number;
}

interface LoggedExercise {
  name: ExerciseName;
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
  sessionType: SessionType;
  exercises: LoggedExercise[];
  checkIn?: SessionCheckIn;
}

export type {
  ExercisePrescription,
  LoggedExercise,
  LoggedSet,
  SessionCheckIn,
  SessionDefinition,
  SessionType,
  WorkoutHistoryEntry,
};
