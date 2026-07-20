import type {
  ExerciseName,
  LoggedExercise,
  LoggedSet,
  SessionType,
  WorkoutHistoryEntry,
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

const toCalendarDay = (date: Date): number =>
  Math.floor(date.getTime() / (24 * 60 * 60 * 1000));

const wasTrainedRecently = (
  history: WorkoutHistoryEntry[],
  now: Date = new Date(),
): boolean => {
  const lastSession = history[history.length - 1];
  if (!lastSession) {
    return false;
  }

  const daysSinceLastSession =
    toCalendarDay(now) - toCalendarDay(new Date(lastSession.date));

  return daysSinceLastSession <= 1;
};

export {
  calculateNextWeight,
  calculateSessionProgression,
  getActualWeight,
  getNextSessionType,
  isExerciseCompleted,
  wasTrainedRecently,
  type ProgressionResult,
};
