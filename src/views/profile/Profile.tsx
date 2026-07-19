import "./Profile.css";

import { Heading, Section, Span } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { EXERCISE, type ExerciseName } from "../../types";

type Props = {
  increments: Record<ExerciseName, number>;
  estimatedOneRepMax: Record<ExerciseName, number> | null;
};

export const Profile = ({ increments, estimatedOneRepMax }: Props) => {
  return (
    <div className="profile__container">
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
