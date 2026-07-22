import "./Session.scss";

import { Pause, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AddCardioForm,
  Button,
  Dialog,
  Expandable,
  Heading,
  PlateBreakdown,
  PlateIndicator,
  Row,
  Stack,
} from "../../components";
import { AddExerciseForm } from "../../components/addexercise/AddExerciseForm";
import { CardioTimerDisplay } from "../../components/cardiotimer/CardioTimerDisplay";
import { Input } from "../../components/input/Input";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { Span } from "../../components/text/Span";
import {
  findCatalogEntry,
  resolveCustomExercise,
} from "../../helpers/exercise-catalog.helper";
import { isExerciseCompleted } from "../../helpers/progression.helper";
import { buildAdHocLoggedExercise } from "../../helpers/session.helper";
import { generateWarmupSets } from "../../helpers/warmup.helper";
import { useCardioTimer } from "../../hooks/useCardioTimer";
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
  const [warmupEntries, setWarmupEntries] = useState<Record<string, { reps: number; weight: number }>>({});
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
      },
    ]);
  };

  const warmupKey = (exerciseIndex: number, warmupIndex: number) =>
    `${exerciseIndex}-${warmupIndex}`;

  const getWarmupEntry = (
    exerciseIndex: number,
    warmupIndex: number,
    defaultWeight: number,
  ) => warmupEntries[warmupKey(exerciseIndex, warmupIndex)] ?? { reps: 0, weight: defaultWeight };

  const updateWarmupEntry = (
    exerciseIndex: number,
    warmupIndex: number,
    field: "reps" | "weight",
    value: number,
    defaultWeight: number,
  ) => {
    const key = warmupKey(exerciseIndex, warmupIndex);
    setWarmupEntries((prev) => ({
      ...prev,
      [key]: { ...(prev[key] ?? { reps: 0, weight: defaultWeight }), [field]: value },
    }));
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
    const entry = input.exerciseId
      ? findCatalogEntry(catalog, input.exerciseId)
      : resolveCustomExercise(catalog, input.customName ?? "");

    if (!entry) {
      return;
    }

    if (entry.custom && !catalog.some((c) => c.id === entry.id)) {
      onRegisterCustomExercise(entry);
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
      {exercises.map((exercise, exerciseIndex) => {
        const visibleWarmups = generateWarmupSets(exercise.weightUsed)
          .map((warmupSet, warmupIndex) => ({
            warmupSet,
            warmupIndex,
            entry: getWarmupEntry(exerciseIndex, warmupIndex, warmupSet.weight),
          }))
          .filter(({ entry }) => entry.reps <= 0);

        return (
          <section className="session__exercise" key={exerciseIndex}>
            <Row justify="between" className="session__exercise-header">
              <ExerciseWithWeight
                label={exercise.label}
                weight={exercise.weightUsed}
              />
              <Row gap="sm" align="center">
                <Span
                  text={`${exercise.sets.length} ${exercise.sets.length < 2 ? "set" : "sets"}`}
                  size="small"
                />
                {exercise.isAdHoc && (
                  <Button
                    icon={Trash2}
                    variant="danger"
                    size="icon"
                    ariaLabel={`Remove ${exercise.label}`}
                    onClick={() => handleRemoveExercise(exerciseIndex)}
                  />
                )}
              </Row>
            </Row>
            <div className="session__sets">
              {visibleWarmups.map(({ warmupSet, warmupIndex, entry }) => (
                <div className="session__set session__set--warmup" key={`warmup-${warmupIndex}`}>
                  <Span text={`${Math.round(warmupSet.percentage * 100)}%`} size="small" />
                  <div className="session__set__inputs">
                    <div className="session__input-group">
                      <div className="session__input-label">
                        <Span text={`Target reps: ${warmupSet.reps}`} size="small" />
                      </div>
                      <Input
                        value={entry.reps}
                        size="medium"
                        onChange={(value) =>
                          updateWarmupEntry(
                            exerciseIndex,
                            warmupIndex,
                            "reps",
                            value,
                            warmupSet.weight,
                          )
                        }
                      />
                    </div>
                    <div className="session__input-group">
                      <div className="session__input-label">
                        <Span text="Weight (kg)" size="small" />
                      </div>
                      <Row gap="sm" align="center">
                        <Input
                          size="medium"
                          value={entry.weight}
                          onChange={(value) =>
                            updateWarmupEntry(
                              exerciseIndex,
                              warmupIndex,
                              "weight",
                              value,
                              warmupSet.weight,
                            )
                          }
                        />
                        <PlateIndicator
                          weight={entry.weight}
                          ariaLabel={`Show plates for ${entry.weight} kg`}
                          onClick={() => setPlateDialogWeight(entry.weight)}
                        />
                      </Row>
                    </div>
                  </div>
                </div>
              ))}
              {exercise.sets.map((set, index) => (
                <div className="session__set" key={index}>
                  <Span text={`Set ${index + 1}`} size="small" />
                  <div className="session__set__inputs">
                    <div className="session__input-group">
                      <div className="session__input-label">
                        <Span
                          text={`Target reps: ${set.targetReps}`}
                          size="small"
                        />
                      </div>
                      <Input
                        value={set.reps}
                        size="medium"
                        onChange={(value) =>
                          updateSet(exerciseIndex, index, "reps", value)
                        }
                      />
                    </div>
                    <div className="session__input-group">
                      <div className="session__input-label">
                        <Span text="Weight (kg)" size="small" />
                      </div>
                      <Row gap="sm" align="center">
                        <Input
                          size="medium"
                          value={set.weight}
                          onChange={(value) =>
                            updateSet(exerciseIndex, index, "weight", value)
                          }
                        />
                        <PlateIndicator
                          weight={set.weight}
                          ariaLabel={`Show plates for ${set.weight} kg`}
                          onClick={() => setPlateDialogWeight(set.weight)}
                        />
                      </Row>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {cardio.map((entry) => (
        <section className="session__exercise session__cardio" key={entry.id}>
          <Row justify="between" className="session__exercise-header">
            <Heading text={entry.label} level="3" />
            <Button
              icon={Trash2}
              variant="danger"
              size="icon"
              ariaLabel={`Remove ${entry.label}`}
              onClick={() => cardioTimer.remove(entry.id)}
            />
          </Row>
          <Row gap="md" align="center" className="session__cardio-controls">
            <Button
              icon={entry.isRunning ? Pause : Play}
              variant={entry.isRunning ? "secondary" : "primary"}
              size="icon"
              ariaLabel={entry.isRunning ? `Pause ${entry.label}` : `Start ${entry.label}`}
              onClick={() =>
                entry.isRunning ? cardioTimer.pause(entry.id) : cardioTimer.start(entry.id)
              }
            />
            <CardioTimerDisplay entry={entry} />
            <div className="session__input-group">
              <div className="session__input-label">
                <Span text="Kcal burned" size="small" />
              </div>
              <Input
                size="medium"
                value={entry.kcal}
                onChange={(value) => cardioTimer.setKcal(entry.id, value)}
              />
            </div>
          </Row>
        </section>
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
        {plateDialogWeight !== null && (
          <PlateBreakdown weight={plateDialogWeight} />
        )}
      </Dialog>
    </Stack>
  );
};
