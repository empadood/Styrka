import "./Profile.css";

import { useState } from "react";

import { Button, Heading, Input, Section, Span } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { EXERCISE, EXERCISE_LABELS, type ExerciseName } from "../../types";

type Props = {
  increments: Record<ExerciseName, number>;
  estimatedOneRepMax: Record<ExerciseName, number> | null;
  workingWeights: Record<ExerciseName, number>;
  onOverrideWeight: (exercise: ExerciseName, weight: number) => void;
};

export const Profile = ({
  increments,
  estimatedOneRepMax,
  workingWeights,
  onOverrideWeight,
}: Props) => {
  const [drafts, setDrafts] =
    useState<Record<ExerciseName, number>>(workingWeights);

  return (
    <div className="profile__container">
      <Section>
        <Heading text="Current Working Weight" />
        <Span
          text="Lower a weight to reduce next session's starting point — for deloads, bad sessions, or illness."
          size="small"
        />
        <div className="profile__configure profile__configure--editable">
          {Object.values(EXERCISE).map((exercise) => (
            <div className="profile__weight-row" key={exercise}>
              <Span text={EXERCISE_LABELS[exercise]} capitalize />
              <div className="profile__weight-edit">
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
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Heading text="Current Estimated One Rep Max" />
        {estimatedOneRepMax && (
          <div className="profile__configure">
            {Object.values(EXERCISE).map((exercise) => (
              <ExerciseWithWeight
                exercise={exercise}
                key={exercise}
                weight={estimatedOneRepMax[exercise]}
              />
            ))}
          </div>
        )}
      </Section>

      <Section>
        <Heading text="Current Incremenation Per Session" />
        <div className="profile__configure">
          <ExerciseWithWeight
            exercise={EXERCISE.benchpress}
            weight={increments[EXERCISE.benchpress]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.deadlift}
            weight={increments[EXERCISE.deadlift]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.ohp}
            weight={increments[EXERCISE.ohp]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.squat}
            weight={increments[EXERCISE.squat]}
          />
        </div>
      </Section>

      <Section>
        <Heading text="Privacy" />
        <Span
          text="We use cookie-free, aggregate analytics to understand app usage. Workout data and personal identifiers are never collected."
          size="small"
        />
      </Section>
    </div>
  );
};
