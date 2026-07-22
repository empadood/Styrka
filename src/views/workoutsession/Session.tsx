import "./Session.scss";

import { Plus } from "lucide-react";
import { useState } from "react";

import {
  AddCardioForm,
  Button,
  Dialog,
  Expandable,
  Heading,
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
  sessionLabel: string;
  exercises: LoggedExercise[];
  cardio: LoggedCardioSession[];
  catalog: ExerciseCatalogEntry[];
  onExercisesChange: (exercises: LoggedExercise[]) => void;
  onCardioChange: (cardio: LoggedCardioSession[]) => void;
  onRegisterCustomExercise: (entry: ExerciseCatalogEntry) => void;
  onFinish: (result: { exercises: LoggedExercise[]; cardio: LoggedCardioSession[] }) => void;
};

export const WorkoutSession = ({
  sessionLabel,
  exercises,
  cardio,
  catalog,
  onExercisesChange,
  onCardioChange,
  onRegisterCustomExercise,
  onFinish,
}: Props) => {
  const [plateDialogWeight, setPlateDialogWeight] = useState<number | null>(null);
  const warmupEntries = useWarmupEntries();
  const cardioTimer = useCardioTimer(cardio, onCardioChange);

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

  const handleRemoveExercise = (exerciseIndex: number) => {
    onExercisesChange(exercises.filter((_, index) => index !== exerciseIndex));
  };

  const handleAddExercise = (input: {
    exerciseId?: string;
    customName?: string;
    sets: number;
    reps: number;
    startingWeight?: number;
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
      ),
    ]);
  };

  return (
    <Stack gap="lg" className="session__container">
      <div className="session__intro">
        <span>{sessionLabel}</span>
        <Heading text="Today's workout" level="2" />
      </div>
      {exercises.map((exercise, exerciseIndex) => (
        <ExerciseCard
          key={exerciseIndex}
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
        />
      ))}
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
      <Button label="Finish workout" onClick={handleFinish} />
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
