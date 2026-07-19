import { SESSION_DEFINITION } from "../data/session-definition";
import type { ExerciseName, LoggedExercise, SessionType } from "../types";

const buildInitialExercises = (
  sessionType: SessionType,
  workingWeights: Record<ExerciseName, number>,
): LoggedExercise[] =>
  SESSION_DEFINITION[sessionType].map((prescription) => ({
    name: prescription.name,
    weightUsed: workingWeights[prescription.name],
    completed: false,
    sets: Array.from({ length: prescription.sets }, () => ({
      targetReps: prescription.reps,
      reps: 0,
      weight: workingWeights[prescription.name],
    })),
  }));

export { buildInitialExercises };
