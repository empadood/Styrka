import { Heading, Section } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { INCREMENTATION } from "../../data/incrementation";
import { EXERCISE } from "../../types";
import "./Profile.css";

const data = {
  ohp: 50,
  squat: 80,
  deadlift: 90,
  benchPress: 66,
};

export const Profile = () => {
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
            weight={INCREMENTATION[EXERCISE.benchpress]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.deadlift}
            weight={INCREMENTATION[EXERCISE.deadlift]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.ohp}
            weight={INCREMENTATION[EXERCISE.ohp]}
          />
          <ExerciseWithWeight
            exercise={EXERCISE.squat}
            weight={INCREMENTATION[EXERCISE.squat]}
          />
        </div>
      </Section>
    </div>
  );
};
