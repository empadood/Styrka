import "./Session.scss";

import { Plus } from "lucide-react";
import { Fragment, type MutableRefObject, useEffect, useState } from "react";

import {
  AddCardioForm,
  Dialog,
  Expandable,
  PlateBreakdown,
  Stack,
} from "../../components";
import { AddExerciseForm } from "../../components/addexercise/AddExerciseForm";
import { CardioEntryCard } from "../../components/workoutsession/CardioEntryCard";
import { ExerciseCard } from "../../components/workoutsession/ExerciseCard";
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
} from "../../types";

type Props = {
  exercises: LoggedExercise[];
  cardio: LoggedCardioSession[];
  catalog: ExerciseCatalogEntry[];
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

  const handleAddExercise = (input: {
    exerciseId?: string;
    customName?: string;
    sets: number;
    reps: number;
    startingWeight?: number;
    showWeightIndicator: boolean;
    showWarmupSets: boolean;
  }) => {
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
      ),
    ]);
  };

  return (
    <Stack gap="lg" className="session__container">
      {exercises.map((exercise, exerciseIndex) => (
        <Fragment key={exerciseIndex}>
          {exerciseIndex === subProgramStartIndex && (
            <div className="session__divider">
              <span className="session__divider-label">{exercise.sourceLabel}</span>
            </div>
          )}
          <ExerciseCard
            exercise={exercise}
            getWarmupEntry={(warmupIndex, defaultWeight) =>
              warmupEntries.getEntry(exerciseIndex, warmupIndex, defaultWeight)
            }
            onWarmupChange={(warmupIndex, field, value, defaultWeight) =>
              warmupEntries.updateEntry(exerciseIndex, warmupIndex, field, value, defaultWeight)
            }
            onSetChange={(setIndex, field, value) => updateSet(exerciseIndex, setIndex, field, value)}
            onShowPlates={setPlateDialogWeight}
            onRemove={() => handleRemoveExercise(exerciseIndex)}
            onAddSet={() => handleAddSet(exerciseIndex)}
          />
        </Fragment>
      ))}
      {cardio.length > 0 && (
        <div className="session__divider">
          <span className="session__divider-label">Cardio</span>
        </div>
      )}
      {cardio.map((entry) => (
        <CardioEntryCard
          key={entry.id}
          entry={entry}
          onStart={() => cardioTimer.start(entry.id)}
          onPause={() => cardioTimer.pause(entry.id)}
          onStop={() => cardioTimer.stop(entry.id)}
          onSave={() => cardioTimer.save(entry.id)}
          onKcalChange={(value) => cardioTimer.setKcal(entry.id, value)}
          onRemove={() => cardioTimer.remove(entry.id)}
        />
      ))}
      <div className="session__divider">
        <span className="session__divider-label">Add to workout</span>
      </div>
      <Stack gap="sm" className="session__add-section">
        <Expandable icon={Plus} label="Add cardio">
          <AddCardioForm onSubmit={handleAddCardio} />
        </Expandable>
        <Expandable icon={Plus} label="Add exercise">
          <AddExerciseForm
            catalog={catalog}
            onSubmit={handleAddExercise}
            showStartingWeight
            submitLabel="Add exercise to this workout"
          />
        </Expandable>
      </Stack>
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
