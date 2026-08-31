import "./Session.scss";

import { type MutableRefObject, useEffect, useState } from "react";

import { Dialog, PlateBreakdown, Stack } from "../../components";
import { type ExerciseFormSubmitInput } from "../../components/addexercise/AddExerciseForm";
import { AddToWorkoutSection } from "../../components/workoutsession/AddToWorkoutSection";
import { CardioList } from "../../components/workoutsession/CardioList";
import { ExerciseList } from "../../components/workoutsession/ExerciseList";
import { resolveExerciseSelection } from "../../helpers/exercise-catalog.helper";
import { isExerciseCompleted } from "../../helpers/progression.helper";
import { buildAdHocLoggedExercise } from "../../helpers/session.helper";
import { useCardioTimer } from "../../hooks/useCardioTimer";
import { useWarmupEntries } from "../../hooks/useWarmupEntries";
import {
  CARDIO_ACTIVITY_LABELS,
  type CardioActivityId,
  type ExerciseCatalogEntry,
  type LoggedCardioSession,
  type LoggedExercise,
  type WorkoutHistoryEntry,
} from "../../types";

type Props = {
  exercises: LoggedExercise[];
  cardio: LoggedCardioSession[];
  catalog: ExerciseCatalogEntry[];
  history: WorkoutHistoryEntry[];
  onExercisesChange: (exercises: LoggedExercise[]) => void;
  onCardioChange: (cardio: LoggedCardioSession[]) => void;
  onRegisterCustomExercise: (entry: ExerciseCatalogEntry) => void;
  onFinish: (result: { exercises: LoggedExercise[]; cardio: LoggedCardioSession[] }) => void;
  finishTriggerRef?: MutableRefObject<() => void>;
};

export const WorkoutSession = ({
  exercises,
  cardio,
  catalog,
  history,
  onExercisesChange,
  onCardioChange,
  onRegisterCustomExercise,
  onFinish,
  finishTriggerRef,
}: Props) => {
  const [plateDialogWeight, setPlateDialogWeight] = useState<number | null>(null);
  const warmupEntries = useWarmupEntries();
  const cardioTimer = useCardioTimer(cardio, onCardioChange);

  const firstSubExerciseIndex = exercises.findIndex((exercise) => Boolean(exercise.sourceLabel));
  const subProgramStartIndex = firstSubExerciseIndex > 0 ? firstSubExerciseIndex : -1;

  const handleAddCardio = (activityId: CardioActivityId) => {
    onCardioChange([
      ...cardio,
      {
        id: crypto.randomUUID(),
        activityId,
        label: CARDIO_ACTIVITY_LABELS[activityId],
        durationSeconds: 0,
        kcal: 0,
        isRunning: false,
        startedAt: null,
        isFinished: false,
        isSaved: false,
      },
    ]);
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number,
  ) => {
    onExercisesChange(
      exercises.map((exercise, index) =>
        index === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, sIndex) =>
                sIndex === setIndex ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  };

  const handleAddSet = (exerciseIndex: number) => {
    onExercisesChange(
      exercises.map((exercise, index) => {
        if (index !== exerciseIndex) {
          return exercise;
        }
        const lastSet = exercise.sets[exercise.sets.length - 1];
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              targetReps: lastSet?.targetReps ?? 0,
              reps: 0,
              weight: lastSet?.weight ?? exercise.weightUsed,
            },
          ],
        };
      }),
    );
  };

  const handleFinish = () => {
    onFinish({
      exercises: exercises.map((exercise) => ({
        ...exercise,
        completed: isExerciseCompleted(exercise.sets),
      })),
      cardio: cardio.map((entry) =>
        entry.isRunning
          ? {
              ...entry,
              isRunning: false,
              startedAt: null,
              durationSeconds: cardioTimer.elapsedSeconds(entry),
            }
          : entry,
      ),
    });
  };

  useEffect(() => {
    if (finishTriggerRef) {
      finishTriggerRef.current = handleFinish;
    }
  });

  const handleRemoveExercise = (exerciseIndex: number) => {
    onExercisesChange(exercises.filter((_, index) => index !== exerciseIndex));
  };

  const handleAddExercise = (input: ExerciseFormSubmitInput) => {
    const entry = resolveExerciseSelection(catalog, input, onRegisterCustomExercise);

    if (!entry) {
      return;
    }

    onExercisesChange([
      ...exercises,
      buildAdHocLoggedExercise(
        entry.id,
        entry.label,
        entry.tracked,
        input.sets,
        input.reps,
        input.startingWeight ?? 0,
        input.showWeightIndicator,
        input.showWarmupSets,
        input.isBodyweight,
      ),
    ]);
  };

  return (
    <Stack gap="lg" className="session__container">
      <ExerciseList
        exercises={exercises}
        subProgramStartIndex={subProgramStartIndex}
        warmupEntries={warmupEntries}
        onSetChange={updateSet}
        onShowPlates={setPlateDialogWeight}
        onRemoveExercise={handleRemoveExercise}
        onAddSet={handleAddSet}
      />
      <CardioList cardio={cardio} cardioTimer={cardioTimer} />
      <div className="session__divider">
        <span className="session__divider-label">Add to workout</span>
      </div>
      <AddToWorkoutSection
        catalog={catalog}
        history={history}
        onAddCardio={handleAddCardio}
        onAddExercise={handleAddExercise}
      />
      <Dialog
        isOpen={plateDialogWeight !== null}
        onClose={() => setPlateDialogWeight(null)}
        title="Plates"
      >
        {plateDialogWeight !== null && <PlateBreakdown weight={plateDialogWeight} />}
      </Dialog>
    </Stack>
  );
};
