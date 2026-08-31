import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { SectionCard } from "../sectioncard/SectionCard";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";

type Props = {
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
};

export const OneRepMaxSection = ({ estimatedOneRepMax }: Props) => (
  <SectionCard title="Current Estimated One Rep Max">
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
  </SectionCard>
);
