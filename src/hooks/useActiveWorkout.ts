import { useState } from "react";

import type { WorkoutStore } from "../data/storage";
import { getCombinedCatalog } from "../helpers/exercise-catalog.helper";
import { getNextProgramSession } from "../helpers/progression.helper";
import { buildInitialExercises } from "../helpers/session.helper";
import type {
  ExerciseCatalogEntry,
  LoggedCardioSession,
  LoggedExercise,
  Program,
  ProgramSession,
  WorkoutStartMode,
} from "../types";
import { usePostWorkoutFlow } from "./usePostWorkoutFlow";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export const useActiveWorkout = (store: WorkoutStore, update: UpdateFn) => {
  const [workoutOpen, setWorkoutOpen] = useState(false);

  const catalog: ExerciseCatalogEntry[] = getCombinedCatalog(store);
  const activeProgram: Program | null =
    store.programs.find((program) => program.id === store.activeProgramId) ??
    null;
  const nextSession: ProgramSession | null = activeProgram
    ? getNextProgramSession(activeProgram, store.lastCompletedSessionId)
    : null;
  const activeSubProgram: Program | null =
    store.programs.find((program) => program.id === store.activeSubProgramId) ??
    null;
  const nextSubSession: ProgramSession | null = activeSubProgram
    ? getNextProgramSession(activeSubProgram, store.lastCompletedSubSessionId)
    : null;
  const workoutActive = store.activeWorkout !== null;

  const closeWorkout = () => {
    setWorkoutOpen(false);
    postWorkoutFlow.reset();
    update((prev) => ({ ...prev, activeWorkout: null }));
  };

  const postWorkoutFlow = usePostWorkoutFlow(store, update, closeWorkout);

  const startWorkout = (mode: WorkoutStartMode) => {
    postWorkoutFlow.reset();
    update((previousStore) => ({
      ...previousStore,
      activeWorkout:
        mode === "freestanding"
          ? {
              programId: null,
              sessionId: null,
              subProgramId: null,
              subSessionId: null,
              sessionLabel: "Free workout",
              exercises: [],
              cardio: [],
            }
          : {
              programId: activeProgram?.id ?? null,
              sessionId: nextSession?.id ?? null,
              subProgramId: activeSubProgram?.id ?? null,
              subSessionId: nextSubSession?.id ?? null,
              sessionLabel: nextSession?.name ?? "Workout",
              exercises: [
                ...buildInitialExercises(
                  nextSession,
                  catalog,
                  previousStore.workingWeights,
                  previousStore.history,
                ),
                ...buildInitialExercises(
                  nextSubSession,
                  catalog,
                  previousStore.workingWeights,
                  previousStore.history,
                  activeSubProgram?.name,
                ),
              ],
              cardio: [],
            },
    }));
    setWorkoutOpen(true);
  };

  const minimizeWorkout = () => setWorkoutOpen(false);
  const resumeWorkout = () => setWorkoutOpen(true);

  const onExercisesChange = (exercises: LoggedExercise[]) =>
    update((prev) =>
      prev.activeWorkout
        ? { ...prev, activeWorkout: { ...prev.activeWorkout, exercises } }
        : prev,
    );

  const onCardioChange = (cardio: LoggedCardioSession[]) =>
    update((prev) =>
      prev.activeWorkout
        ? { ...prev, activeWorkout: { ...prev.activeWorkout, cardio } }
        : prev,
    );

  const onRegisterCustomExercise = (entry: ExerciseCatalogEntry) =>
    update((prev) => ({
      ...prev,
      customExerciseCatalog: [...prev.customExerciseCatalog, entry],
    }));

  return {
    workoutOpen,
    workoutActive,
    stage: postWorkoutFlow.stage,
    catalog,
    activeProgram,
    nextSession,
    activeSubProgram,
    nextSubSession,
    pendingSession: postWorkoutFlow.pendingSession,
    pendingResults: postWorkoutFlow.pendingResults,
    startWorkout,
    closeWorkout,
    minimizeWorkout,
    resumeWorkout,
    onExercisesChange,
    onCardioChange,
    onRegisterCustomExercise,
    onFinish: postWorkoutFlow.onFinish,
    onBackToWorkout: postWorkoutFlow.onBackToWorkout,
    onContinueFromOneRepMax: postWorkoutFlow.onContinueFromOneRepMax,
    onConfirmPostWorkout: postWorkoutFlow.onConfirmPostWorkout,
  };
};

export type ActiveWorkoutState = ReturnType<typeof useActiveWorkout>;
