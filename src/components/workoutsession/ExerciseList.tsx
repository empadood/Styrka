import { Fragment } from "react";

import type { WarmupEntriesApi } from "../../hooks/useWarmupEntries";
import type { LoggedExercise } from "../../types";
import { ExerciseCard } from "./ExerciseCard";

type Props = {
  exercises: LoggedExercise[];
  subProgramStartIndex: number;
  warmupEntries: WarmupEntriesApi;
  onSetChange: (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: number,
  ) => void;
  onShowPlates: (weight: number) => void;
  onRemoveExercise: (exerciseIndex: number) => void;
  onAddSet: (exerciseIndex: number) => void;
};

export const ExerciseList = ({
  exercises,
  subProgramStartIndex,
  warmupEntries,
  onSetChange,
  onShowPlates,
  onRemoveExercise,
  onAddSet,
}: Props) => (
  <>
    {exercises.map((exercise, exerciseIndex) => (
      <Fragment key={exerciseIndex}>
        {exerciseIndex === subProgramStartIndex && (
          <div className="session__divider">
            <span className="session__divider-label">{exercise.sourceLabel}</span>
          </div>
        )}
        <ExerciseCard
          exercise={exercise}
          getWarmupEntry={(warmupIndex, defaultWeight) =>
            warmupEntries.getEntry(exerciseIndex, warmupIndex, defaultWeight)
          }
          onWarmupChange={(warmupIndex, field, value, defaultWeight) =>
            warmupEntries.updateEntry(exerciseIndex, warmupIndex, field, value, defaultWeight)
          }
          onSetChange={(setIndex, field, value) => onSetChange(exerciseIndex, setIndex, field, value)}
          onShowPlates={onShowPlates}
          onRemove={() => onRemoveExercise(exerciseIndex)}
          onAddSet={() => onAddSet(exerciseIndex)}
        />
      </Fragment>
    ))}
  </>
);
