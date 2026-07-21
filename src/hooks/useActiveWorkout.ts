import { useState } from "react";

import type { WorkoutStore } from "../data/storage";
import { getCombinedCatalog } from "../helpers/exercise-catalog.helper";
import { calculateSessionProgression, getNextProgramSession, type ProgressionResult } from "../helpers/progression.helper";
import { buildInitialExercises } from "../helpers/session.helper";
import type {
  ExerciseCatalogEntry,
  LoggedExercise,
  Program,
  ProgramSession,
  SessionCheckIn,
  TrackedLiftId,
} from "../types";

type Stage = "workout" | "onerepmax" | "summary";

type PendingSession = { exercises: LoggedExercise[] };

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export const useActiveWorkout = (store: WorkoutStore, update: UpdateFn) => {
  const [workoutOpen, setWorkoutOpen] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(
    null,
  );
  const [pendingResults, setPendingResults] = useState<
    ProgressionResult[] | null
  >(null);

  const catalog: ExerciseCatalogEntry[] = getCombinedCatalog(store);
  const activeProgram: Program | null =
    store.programs.find((program) => program.id === store.activeProgramId) ??
    null;
  const nextSession: ProgramSession | null = activeProgram
    ? getNextProgramSession(activeProgram, store.lastCompletedSessionId)
    : null;
  const workoutActive = store.activeWorkout !== null;
  const stage: Stage = pendingResults
    ? "summary"
    : pendingSession
      ? "onerepmax"
      : "workout";

  const startWorkout = (mode: "program" | "freestanding") => {
    setPendingSession(null);
    setPendingResults(null);
    update((previousStore) => ({
      ...previousStore,
      activeWorkout:
        mode === "freestanding"
          ? {
              programId: null,
              sessionId: null,
              sessionLabel: "Free workout",
              exercises: [],
            }
          : {
              programId: activeProgram?.id ?? null,
              sessionId: nextSession?.id ?? null,
              sessionLabel: nextSession?.name ?? "Workout",
              exercises: buildInitialExercises(
                nextSession,
                catalog,
                previousStore.workingWeights,
                previousStore.history,
              ),
            },
    }));
    setWorkoutOpen(true);
  };

  const closeWorkout = () => {
    setWorkoutOpen(false);
    setPendingSession(null);
    setPendingResults(null);
    update((prev) => ({ ...prev, activeWorkout: null }));
  };

  const minimizeWorkout = () => setWorkoutOpen(false);
  const resumeWorkout = () => setWorkoutOpen(true);

  const onExercisesChange = (exercises: LoggedExercise[]) =>
    update((prev) =>
      prev.activeWorkout
        ? { ...prev, activeWorkout: { ...prev.activeWorkout, exercises } }
        : prev,
    );

  const onRegisterCustomExercise = (entry: ExerciseCatalogEntry) =>
    update((prev) => ({
      ...prev,
      customExerciseCatalog: [...prev.customExerciseCatalog, entry],
    }));

  const onFinish = (result: PendingSession) => setPendingSession(result);

  const onBackToWorkout = () => {
    if (!pendingSession || !store.activeWorkout) {
      return;
    }

    update((prev) =>
      prev.activeWorkout
        ? {
            ...prev,
            activeWorkout: {
              ...prev.activeWorkout,
              exercises: pendingSession.exercises,
            },
          }
        : prev,
    );
    setPendingResults(null);
    setPendingSession(null);
  };

  const onContinueFromOneRepMax = () => {
    if (!pendingSession) {
      return;
    }
    setPendingResults(
      calculateSessionProgression(pendingSession.exercises, store.increments),
    );
  };

  const onConfirmPostWorkout = (
    finalIncrements: Record<TrackedLiftId, number>,
    checkIn: SessionCheckIn,
  ) => {
    if (!pendingResults || !pendingSession || !store.activeWorkout) {
      return;
    }

    update((prev) => {
      if (!prev.activeWorkout) {
        return prev;
      }

      const workingWeights = { ...prev.workingWeights };
      pendingResults.forEach((result) => {
        if (result.tracked && result.completed) {
          workingWeights[result.exerciseId as TrackedLiftId] =
            result.previousWeight +
            (finalIncrements[result.exerciseId as TrackedLiftId] ??
              result.proposedIncrement!);
        }
      });

      const isFreestanding = prev.activeWorkout.sessionId === null;

      return {
        ...prev,
        workingWeights,
        increments: { ...prev.increments, ...finalIncrements },
        lastCompletedSessionId: isFreestanding
          ? prev.lastCompletedSessionId
          : (prev.activeWorkout.sessionId ?? prev.lastCompletedSessionId),
        history: [
          ...prev.history,
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            programId: prev.activeWorkout.programId,
            sessionId: prev.activeWorkout.sessionId,
            sessionLabel: prev.activeWorkout.sessionLabel,
            exercises: pendingSession.exercises,
            checkIn,
          },
        ],
        activeWorkout: null,
      };
    });
    closeWorkout();
  };

  return {
    workoutOpen,
    workoutActive,
    stage,
    catalog,
    activeProgram,
    nextSession,
    pendingSession,
    pendingResults,
    startWorkout,
    closeWorkout,
    minimizeWorkout,
    resumeWorkout,
    onExercisesChange,
    onRegisterCustomExercise,
    onFinish,
    onBackToWorkout,
    onContinueFromOneRepMax,
    onConfirmPostWorkout,
  };
};

export type ActiveWorkoutState = ReturnType<typeof useActiveWorkout>;
