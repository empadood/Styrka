import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { SectionCard } from "../sectioncard/SectionCard";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";

type Props = {
  increments: Record<TrackedLiftId, number>;
};

export const IncrementsSection = ({ increments }: Props) => (
  <SectionCard title="Current Incremenation Per Session">
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
  </SectionCard>
);
