import { useMemo } from "react";

import type { WorkoutStore } from "../data/storage";
import { trackAnalyticsEvent } from "../helpers/analytics.helper";
import {
  buildBodyWeightTrendData,
  getBodyWeightChartDomain,
  upsertBodyWeightEntry,
} from "../helpers/bodyweight.helper";
import { buildOverviewFromStore } from "../helpers/overview.helper";
import { buildStartingWeights } from "../helpers/starting-weight.helper";
import { getTrainingStatusDetails } from "../helpers/status.helper";
import { buildTrendData } from "../helpers/trends.helper";
import type { TrackedLiftId } from "../types";
import type { ActiveWorkoutState } from "./useActiveWorkout";
import { useWeightUnit } from "./useWeightUnit";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

export const useHomeDashboard = (
  store: WorkoutStore,
  update: UpdateFn,
  workout: ActiveWorkoutState,
) => {
  const { unit, toDisplay } = useWeightUnit();
  const roundingStep = store.weightRounding[unit];
  const items = useMemo(
    () => buildOverviewFromStore(store, unit, roundingStep),
    [store, unit, roundingStep],
  );
  const trendData = useMemo(
    () =>
      buildTrendData(store.history).map((entry) => {
        const converted: typeof entry = { ...entry };
        (["squat", "deadlift", "ohp", "benchpress"] as const).forEach((lift) => {
          if (converted[lift] !== undefined) {
            converted[lift] = toDisplay(converted[lift] as number);
          }
        });
        return converted;
      }),
    [store.history, toDisplay],
  );
  const bodyWeightTrendData = useMemo(
    () =>
      buildBodyWeightTrendData(store.bodyWeightLog).map((entry) => ({
        ...entry,
        weight: toDisplay(entry.weight),
      })),
    [store.bodyWeightLog, toDisplay],
  );
  const bodyWeightChartDomain = useMemo(() => {
    const domain = getBodyWeightChartDomain(store.bodyWeightLog);
    return domain ? ([toDisplay(domain[0]), toDisplay(domain[1])] as [number, number]) : undefined;
  }, [store.bodyWeightLog, toDisplay]);
  const trainingStatusDetails = useMemo(
    () => getTrainingStatusDetails(store.history),
    [store.history],
  );
  const trainingStatus = trainingStatusDetails.status;

  const handleLogBodyWeight = (weight: number, bodyFatPercent?: number) => {
    update((previousStore) => ({
      ...previousStore,
      bodyWeightLog: upsertBodyWeightEntry(
        previousStore.bodyWeightLog,
        new Date().toISOString(),
        weight,
        bodyFatPercent,
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
    bodyWeightChartDomain,
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
