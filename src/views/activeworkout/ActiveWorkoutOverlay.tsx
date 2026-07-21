import { Minimize2 } from "lucide-react";

import { Dialog } from "../../components/dialog/Dialog";
import type { WorkoutStore } from "../../data/storage";
import { calculateSessionOneRepMax } from "../../helpers/one-rep-max.helper";
import type { ActiveWorkoutState } from "../../hooks/useActiveWorkout";
import type { DriveSyncState } from "../../hooks/useDriveSync";
import { OneRepMax } from "../onerepmax/OneRepMax";
import { PostWorkout } from "../postworkout/PostWorkout";
import { WorkoutSession } from "../workoutsession/Session";

type Stage = "workout" | "onerepmax" | "summary";

const DIALOG_TITLES: Record<Stage, string> = {
  workout: "Workout",
  onerepmax: "Estimated 1RM",
  summary: "Workout Summary",
};

type Props = {
  store: WorkoutStore;
  workout: ActiveWorkoutState;
  drive: DriveSyncState;
};

export const ActiveWorkoutOverlay = ({ store, workout, drive }: Props) => {
  if (!store.hasConfiguredOneRepMax) {
    return null;
  }

  return (
    <Dialog
      title={DIALOG_TITLES[workout.stage as Stage]}
      isOpen={workout.workoutOpen}
      onClose={workout.minimizeWorkout}
      actionLabel="Minimize"
      actionAriaLabel="Minimize workout"
      actionIcon={Minimize2}
      destructiveAction={{
        label: "Discard workout",
        onClick: workout.closeWorkout,
        ariaLabel: "Discard active workout",
      }}
    >
      {workout.stage === "workout" && (
        <WorkoutSession
          sessionLabel={store.activeWorkout?.sessionLabel ?? ""}
          exercises={store.activeWorkout?.exercises ?? []}
          catalog={workout.catalog}
          onExercisesChange={workout.onExercisesChange}
          onRegisterCustomExercise={workout.onRegisterCustomExercise}
          onFinish={workout.onFinish}
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
