import { Minimize2 } from "lucide-react";
import { useRef } from "react";

import { Dialog } from "../../components/dialog/Dialog";
import type { WorkoutStore } from "../../data/storage";
import { calculateSessionOneRepMax } from "../../helpers/one-rep-max.helper";
import type { ActiveWorkoutState } from "../../hooks/useActiveWorkout";
import type { DriveSyncState } from "../../hooks/useDriveSync";
import { OneRepMax } from "../onerepmax/OneRepMax";
import { PostWorkout } from "../postworkout/PostWorkout";
import { WorkoutSession } from "../workoutsession/Session";

type Stage = "workout" | "onerepmax" | "summary";

const DIALOG_TITLES: Record<Exclude<Stage, "workout">, string> = {
  onerepmax: "Estimated 1RM",
  summary: "Workout Summary",
};

type Props = {
  store: WorkoutStore;
  workout: ActiveWorkoutState;
  drive: DriveSyncState;
};

export const ActiveWorkoutOverlay = ({ store, workout, drive }: Props) => {
  const finishTriggerRef = useRef<() => void>(() => {});

  if (!store.hasConfiguredOneRepMax) {
    return null;
  }

  const sessionLabel = store.activeWorkout?.sessionLabel;
  const workoutTitle = [sessionLabel].filter(Boolean).join(" · ");

  const title =
    workout.stage === "workout" ? workoutTitle : DIALOG_TITLES[workout.stage];

  const action =
    workout.stage === "workout"
      ? {
          actionLabel: "Finish workout",
          onAction: () => finishTriggerRef.current(),
        }
      : {
          actionLabel: "Minimize",
          onAction: undefined,
        };

  return (
    <Dialog
      title={title}
      isOpen={workout.workoutOpen}
      onClose={workout.minimizeWorkout}
      closeIcon={Minimize2}
      closeAriaLabel="Minimize workout"
      actionLabel={action.actionLabel}
      onAction={action.onAction}
      destructiveAction={{
        label: "Discard workout",
        onClick: workout.closeWorkout,
        ariaLabel: "Discard active workout",
      }}
    >
      {workout.stage === "workout" && (
        <WorkoutSession
          exercises={store.activeWorkout?.exercises ?? []}
          cardio={store.activeWorkout?.cardio ?? []}
          catalog={workout.catalog}
          onExercisesChange={workout.onExercisesChange}
          onCardioChange={workout.onCardioChange}
          onRegisterCustomExercise={workout.onRegisterCustomExercise}
          onFinish={workout.onFinish}
          finishTriggerRef={finishTriggerRef}
        />
      )}
      {workout.stage === "onerepmax" && workout.pendingSession && (
        <OneRepMax
          results={calculateSessionOneRepMax(
            workout.pendingSession.exercises,
            store,
          )}
          onContinue={workout.onContinueFromOneRepMax}
        />
      )}
      {workout.stage === "summary" && workout.pendingResults && (
        <PostWorkout
          results={workout.pendingResults}
          onConfirm={workout.onConfirmPostWorkout}
          onBack={workout.onBackToWorkout}
          drive={drive}
        />
      )}
    </Dialog>
  );
};
