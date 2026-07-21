import { EXERCISE_LABELS } from "../types/exercise.type";
import type { Program } from "../types/program.type";
import type { LoggedExercise, WorkoutHistoryEntry } from "../types/workout-session.type";
import { BUILT_IN_PROGRAMS, STARTING_STRENGTH_PROGRAM_ID } from "./built-in-programs";
import type { ActiveWorkout } from "./storage";

const mergeBuiltInPrograms = (existingPrograms: unknown): Program[] => {
  const userPrograms = Array.isArray(existingPrograms)
    ? existingPrograms.filter(
        (program): program is Program =>
          program && typeof program === "object" && !program.isBuiltIn,
      )
    : [];

  return [...BUILT_IN_PROGRAMS, ...userPrograms];
};

const resolveActiveProgramId = (
  parsed: { activeProgramId?: unknown },
  mergedPrograms: Program[],
): string | null => {
  if (
    typeof parsed.activeProgramId === "string" &&
    mergedPrograms.some((program) => program.id === parsed.activeProgramId)
  ) {
    return parsed.activeProgramId;
  }
  return STARTING_STRENGTH_PROGRAM_ID;
};

const resolveLastCompletedSessionId = (parsed: {
  lastCompletedSessionId?: unknown;
  lastCompletedSession?: unknown;
}): string | null => {
  if (typeof parsed.lastCompletedSessionId === "string") {
    return parsed.lastCompletedSessionId;
  }
  if (typeof parsed.lastCompletedSession === "string") {
    return parsed.lastCompletedSession;
  }
  return null;
};

const migrateLegacyLoggedExercise = (
  raw: Record<string, unknown>,
): LoggedExercise => {
  if (raw.exerciseId !== undefined) {
    return raw as unknown as LoggedExercise;
  }

  const legacyName = raw.name as string;
  return {
    exerciseId: legacyName,
    label: EXERCISE_LABELS[legacyName as keyof typeof EXERCISE_LABELS] ?? legacyName,
    tracked: true,
    isAdHoc: false,
    sets: raw.sets as LoggedExercise["sets"],
    completed: raw.completed as boolean,
    weightUsed: raw.weightUsed as number,
  };
};

const migrateLegacyHistoryEntry = (
  raw: Record<string, unknown>,
): WorkoutHistoryEntry => {
  if (raw.sessionId !== undefined) {
    return {
      ...raw,
      exercises: (raw.exercises as Record<string, unknown>[]).map(
        migrateLegacyLoggedExercise,
      ),
    } as unknown as WorkoutHistoryEntry;
  }

  const legacySessionType = raw.sessionType as string;
  return {
    id: raw.id as string,
    date: raw.date as string,
    programId: STARTING_STRENGTH_PROGRAM_ID,
    sessionId: legacySessionType,
    sessionLabel: legacySessionType === "A" ? "Session A" : "Session B",
    exercises: (raw.exercises as Record<string, unknown>[]).map(
      migrateLegacyLoggedExercise,
    ),
    checkIn: raw.checkIn as WorkoutHistoryEntry["checkIn"],
  };
};

const migrateLegacyActiveWorkout = (
  raw: Record<string, unknown> | null,
): ActiveWorkout | null => {
  if (!raw) {
    return null;
  }

  if (raw.sessionType !== undefined) {
    const legacySessionType = raw.sessionType as string;
    return {
      programId: STARTING_STRENGTH_PROGRAM_ID,
      sessionId: legacySessionType,
      sessionLabel: legacySessionType === "A" ? "Session A" : "Session B",
      exercises: (raw.exercises as Record<string, unknown>[]).map(
        migrateLegacyLoggedExercise,
      ),
    };
  }

  return {
    ...raw,
    exercises: (raw.exercises as Record<string, unknown>[]).map(
      migrateLegacyLoggedExercise,
    ),
  } as unknown as ActiveWorkout;
};

export {
  mergeBuiltInPrograms,
  migrateLegacyActiveWorkout,
  migrateLegacyHistoryEntry,
  migrateLegacyLoggedExercise,
  resolveActiveProgramId,
  resolveLastCompletedSessionId,
};
