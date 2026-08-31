import { useState } from "react";

import type { WorkoutStore } from "../data/storage";
import { calculateSessionProgression, type ProgressionResult } from "../helpers/progression.helper";
import type {
  ActiveWorkoutStage,
  LoggedCardioSession,
  LoggedExercise,
  SessionCheckIn,
  TrackedLiftId,
} from "../types";

type PendingSession = { exercises: LoggedExercise[]; cardio: LoggedCardioSession[] };

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export const usePostWorkoutFlow = (
  store: WorkoutStore,
  update: UpdateFn,
  closeWorkout: () => void,
) => {
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null);
  const [pendingResults, setPendingResults] = useState<ProgressionResult[] | null>(null);

  const stage: ActiveWorkoutStage = pendingResults
    ? "summary"
    : pendingSession
      ? "onerepmax"
      : "workout";

  const reset = () => {
    setPendingSession(null);
    setPendingResults(null);
  };

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
              cardio: pendingSession.cardio,
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
        lastCompletedSubSessionId: isFreestanding
          ? prev.lastCompletedSubSessionId
          : (prev.activeWorkout.subSessionId ?? prev.lastCompletedSubSessionId),
        history: [
          ...prev.history,
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            programId: prev.activeWorkout.programId,
            sessionId: prev.activeWorkout.sessionId,
            subProgramId: prev.activeWorkout.subProgramId,
            subSessionId: prev.activeWorkout.subSessionId,
            sessionLabel: prev.activeWorkout.sessionLabel,
            exercises: pendingSession.exercises,
            cardio: pendingSession.cardio,
            checkIn,
          },
        ],
        activeWorkout: null,
      };
    });
    closeWorkout();
  };

  return {
    stage,
    pendingSession,
    pendingResults,
    reset,
    onFinish,
    onBackToWorkout,
    onContinueFromOneRepMax,
    onConfirmPostWorkout,
  };
};
