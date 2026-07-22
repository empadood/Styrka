import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { Card } from "../card/Card";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";
import { Heading } from "../text/Heading";

type Props = {
  increments: Record<TrackedLiftId, number>;
};

export const IncrementsSection = ({ increments }: Props) => (
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
);
