import { useMemo } from "react";

import type { WorkoutStore } from "../data/storage";
import { trackAnalyticsEvent } from "../helpers/analytics.helper";
import { buildBodyWeightTrendData, upsertBodyWeightEntry } from "../helpers/bodyweight.helper";
import { buildOverviewFromStore } from "../helpers/overview.helper";
import { buildStartingWeights } from "../helpers/starting-weight.helper";
import { getTrainingStatusDetails } from "../helpers/status.helper";
import { buildTrendData } from "../helpers/trends.helper";
import type { TrackedLiftId } from "../types";
import type { ActiveWorkoutState } from "./useActiveWorkout";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export const useHomeDashboard = (
  store: WorkoutStore,
  update: UpdateFn,
  workout: ActiveWorkoutState,
) => {
  const items = useMemo(() => buildOverviewFromStore(store), [store]);
  const trendData = useMemo(() => buildTrendData(store.history), [store.history]);
  const bodyWeightTrendData = useMemo(
    () => buildBodyWeightTrendData(store.bodyWeightLog),
    [store.bodyWeightLog],
  );
  const trainingStatusDetails = useMemo(
    () => getTrainingStatusDetails(store.history),
    [store.history],
  );
  const trainingStatus = trainingStatusDetails.status;

  const handleLogBodyWeight = (weight: number) => {
    update((previousStore) => ({
      ...previousStore,
      bodyWeightLog: upsertBodyWeightEntry(
        previousStore.bodyWeightLog,
        new Date().toISOString(),
        weight,
      ),
    }));
  };

  const handleOverrideWorkingWeight = (exercise: TrackedLiftId, weight: number) => {
    update((previousStore) => ({
      ...previousStore,
      workingWeights: { ...previousStore.workingWeights, [exercise]: weight },
    }));
  };

  const handleCompleteOneRepMaxSetup = (estimatedOneRepMax: Record<TrackedLiftId, number>) => {
    update((previousStore) => ({
      ...previousStore,
      estimatedOneRepMax,
      hasConfiguredOneRepMax: true,
      workingWeights: buildStartingWeights(estimatedOneRepMax),
    }));
    trackAnalyticsEvent("Onboarding completed");
  };

  const startWorkout = () => {
    workout.startWorkout("program");
    trackAnalyticsEvent("Workout started");
  };

  const startFreestandingWorkout = () => {
    workout.startWorkout("freestanding");
    trackAnalyticsEvent("Freestanding workout started");
  };

  const resumeWorkout = () => {
    trackAnalyticsEvent("Workout resumed");
    workout.resumeWorkout();
  };

  return {
    items,
    trendData,
    bodyWeightTrendData,
    trainingStatus,
    trainingStatusDetails,
    handleLogBodyWeight,
    handleOverrideWorkingWeight,
    handleCompleteOneRepMaxSetup,
    startWorkout,
    startFreestandingWorkout,
    resumeWorkout,
  };
};
