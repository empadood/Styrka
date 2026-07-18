import "./Profile.css";

import { Heading, Section } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { EXERCISE, type ExerciseName } from "../../types";

const data = {
  ohp: 50,
  squat: 80,
  deadlift: 90,
  benchPress: 66,
};

type Props = {
  increments: Record<ExerciseName, number>;
};

export const Profile = ({ increments }: Props) => {
  return (
    <div className="profile__container">
      <Section>
        <Heading text="Current Estimated One Rep Max" />
        <div className="profile__configure">
          <ExerciseWithWeight
            exercise={EXERCISE.benchpress}
            weight={data.benchPress}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.deadlift}
            weight={data.deadlift}
          />
          <ExerciseWithWeight exercise={EXERCISE.ohp} weight={data.ohp} />
          <ExerciseWithWeight exercise={EXERCISE.squat} weight={data.squat} />
        </div>
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
    </div>
  );
};
