import type { ExerciseId } from "./exercise-catalog.type";

interface ProgramExercisePrescription {
  exerciseId: ExerciseId;
  label: string;
  sets: number;
  reps: number;
}

interface ProgramSession {
  id: string;
  name: string;
  exercises: ProgramExercisePrescription[];
}

interface Program {
  id: string;
  name: string;
  description?: string;
  sessions: ProgramSession[];
  isBuiltIn: boolean;
  createdAt: string;
}

export type { Program, ProgramExercisePrescription, ProgramSession };
