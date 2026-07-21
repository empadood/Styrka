import type {
  ExerciseId,
  LoggedExercise,
  LoggedSet,
  TrackedLiftId,
  WorkoutHistoryEntry,
} from "../types";
import type { Program, ProgramSession } from "../types/program.type";

interface ProgressionResult {
  exerciseId: ExerciseId;
  label: string;
  tracked: boolean;
  completed: boolean;
  previousWeight: number;
  proposedIncrement: number | null;
  proposedWeight: number | null;
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
  currentIncrements: Record<TrackedLiftId, number>,
): ProgressionResult[] =>
  loggedExercises.map((ex) => {
    const completed = isExerciseCompleted(ex.sets);
    const previousWeight = getActualWeight(ex.sets);

    if (!ex.tracked) {
      return {
        exerciseId: ex.exerciseId,
        label: ex.label,
        tracked: false,
        completed,
        previousWeight,
        proposedIncrement: null,
        proposedWeight: null,
      };
    }

    const proposedIncrement = currentIncrements[ex.exerciseId as TrackedLiftId];
    return {
      exerciseId: ex.exerciseId,
      label: ex.label,
      tracked: true,
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

const getNextProgramSession = (
  program: Program,
  lastCompletedSessionId: string | null,
): ProgramSession | null => {
  if (program.sessions.length === 0) {
    return null;
  }

  const lastIndex = program.sessions.findIndex(
    (session) => session.id === lastCompletedSessionId,
  );
  const nextIndex = lastIndex === -1 ? 0 : (lastIndex + 1) % program.sessions.length;
  return program.sessions[nextIndex];
};

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
  getNextProgramSession,
  isExerciseCompleted,
  type ProgressionResult,
  wasTrainedRecently,
};
