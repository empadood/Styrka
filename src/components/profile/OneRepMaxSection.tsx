import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { Card } from "../card/Card";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";
import { Heading } from "../text/Heading";

type Props = {
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
};

export const OneRepMaxSection = ({ estimatedOneRepMax }: Props) => (
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
);
