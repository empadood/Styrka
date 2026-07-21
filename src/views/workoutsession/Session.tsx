import "./Session.scss";

import { Plus, Trash2, Weight as WeightIcon } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Dialog,
  Expandable,
  Heading,
  PlateBreakdown,
  Row,
  Stack,
} from "../../components";
import { AddExerciseForm } from "../../components/addexercise/AddExerciseForm";
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
import type { ExerciseCatalogEntry, LoggedExercise } from "../../types";

type Props = {
  sessionLabel: string;
  exercises: LoggedExercise[];
  catalog: ExerciseCatalogEntry[];
  onExercisesChange: (exercises: LoggedExercise[]) => void;
  onRegisterCustomExercise: (entry: ExerciseCatalogEntry) => void;
  onFinish: (result: { exercises: LoggedExercise[] }) => void;
};

export const WorkoutSession = ({
  sessionLabel,
  exercises,
  catalog,
  onExercisesChange,
  onRegisterCustomExercise,
  onFinish,
}: Props) => {
  const [plateDialogWeight, setPlateDialogWeight] = useState<number | null>(null);
  const [warmupEntries, setWarmupEntries] = useState<Record<string, { reps: number; weight: number }>>({});

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
      {exercises.map((exercise, exerciseIndex) => (
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
              <Button
                icon={WeightIcon}
                variant="secondary"
                size="icon"
                ariaLabel={`Show plates for ${exercise.label}`}
                onClick={() => setPlateDialogWeight(exercise.weightUsed)}
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
          {(() => {
            const warmupSets = generateWarmupSets(exercise.weightUsed);
            if (warmupSets.length === 0) {
              return null;
            }

            const visibleWarmups = warmupSets
              .map((warmupSet, warmupIndex) => ({
                warmupSet,
                warmupIndex,
                entry: getWarmupEntry(exerciseIndex, warmupIndex, warmupSet.weight),
              }))
              .filter(({ entry }) => entry.reps <= 0);

            return (
              <Expandable icon={WeightIcon} label="Warm-up sets">
                {visibleWarmups.length === 0 ? (
                  <Span text="All warm-up sets done." size="small" />
                ) : (
                  <div className="session__sets">
                    {visibleWarmups.map(({ warmupSet, warmupIndex, entry }) => (
                      <div className="session__set" key={warmupIndex}>
                        <Span text={`${Math.round(warmupSet.percentage * 100)}%`} size="small" />
                        <div className="session__set__inputs">
                          <div className="session__input-group">
                            <div className="session__input-label">
                              <Span
                                text={`Target reps: ${warmupSet.reps}`}
                                size="small"
                              />
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Expandable>
            );
          })()}
          <div className="session__sets">
            <div className="session__set session__set--header">
              <span />
              <div className="session__set__inputs">
                <Span
                  text={`Target reps: ${exercise.sets[0]?.targetReps ?? ""}`}
                  size="small"
                />
                <Span text="Weight (kg)" size="small" />
              </div>
            </div>
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
                      <Button
                        icon={WeightIcon}
                        variant="secondary"
                        size="icon"
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
      ))}
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
