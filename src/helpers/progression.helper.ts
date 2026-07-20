import type {
  ExerciseName,
  LoggedExercise,
  LoggedSet,
  SessionType,
} from "../types";

interface ProgressionResult {
  name: ExerciseName;
  completed: boolean;
  previousWeight: number;
  proposedIncrement: number;
  proposedWeight: number;
}

const isExerciseCompleted = (sets: LoggedSet[]): boolean =>
  sets.every((s) => s.reps >= s.targetReps);

const getActualWeight = (sets: LoggedSet[]): number =>
  Math.max(...sets.map((s) => s.weight));

const calculateNextWeight = (
  currentWeight: number,
  increment: number,
  completed: boolean,
): number => (completed ? currentWeight + increment : currentWeight);

const calculateSessionProgression = (
  loggedExercises: LoggedExercise[],
  currentIncrements: Record<ExerciseName, number>,
): ProgressionResult[] =>
  loggedExercises.map((ex) => {
    const completed = isExerciseCompleted(ex.sets);
    const previousWeight = getActualWeight(ex.sets);
    const proposedIncrement = currentIncrements[ex.name];
    return {
      name: ex.name,
      completed,
      previousWeight,
      proposedIncrement,
      proposedWeight: calculateNextWeight(
        previousWeight,
        proposedIncrement,
        completed,
      ),
    };
  });

const getNextSessionType = (last: SessionType | null): SessionType =>
  last === "A" ? "B" : "A";

export {
  calculateNextWeight,
  calculateSessionProgression,
  getActualWeight,
  getNextSessionType,
  isExerciseCompleted,
  type ProgressionResult,
};
