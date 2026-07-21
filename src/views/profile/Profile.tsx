import "./Profile.scss";

import { useState } from "react";

import { Button, Card, Heading, Input, Row, Span, Stack } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";

type Props = {
  increments: Record<TrackedLiftId, number>;
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
};

export const Profile = ({
  increments,
  estimatedOneRepMax,
  workingWeights,
  onOverrideWeight,
}: Props) => {
  const [drafts, setDrafts] =
    useState<Record<TrackedLiftId, number>>(workingWeights);

  return (
    <Stack gap="lg" className="profile__container">
      <Card>
        <Heading text="Current Working Weight" />
        <Span
          text="Lower a weight to reduce next session's starting point — for deloads, bad sessions, or illness."
          size="small"
        />
        <div className="profile__configure profile__configure--editable">
          {Object.values(EXERCISE).map((exercise) => (
            <Row justify="between" className="profile__weight-row" key={exercise}>
              <Span text={EXERCISE_LABELS[exercise]} capitalize />
              <Row gap="sm" className="profile__weight-edit">
                <Input
                  value={drafts[exercise]}
                  size="small"
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [exercise]: value }))
                  }
                />
                <Button
                  label="Save"
                  variant="secondary"
                  onClick={() => onOverrideWeight(exercise, drafts[exercise])}
                />
              </Row>
            </Row>
          ))}
        </div>
      </Card>

      <Card>
        <Heading text="Current Estimated One Rep Max" />
        {estimatedOneRepMax && (
          <div className="profile__configure">
            {Object.values(EXERCISE).map((exercise) => (
              <ExerciseWithWeight
                label={EXERCISE_LABELS[exercise]}
                key={exercise}
                weight={estimatedOneRepMax[exercise]}
              />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <Heading text="Current Incremenation Per Session" />
        <div className="profile__configure">
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.benchpress]}
            weight={increments[EXERCISE.benchpress]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.deadlift]}
            weight={increments[EXERCISE.deadlift]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.ohp]}
            weight={increments[EXERCISE.ohp]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.squat]}
            weight={increments[EXERCISE.squat]}
          />
        </div>
      </Card>

      <Card>
        <Heading text="Privacy" />
        <Span
          text="We use cookie-free, aggregate analytics to understand app usage. Workout data and personal identifiers are never collected."
          size="small"
        />
      </Card>
    </Stack>
  );
};
