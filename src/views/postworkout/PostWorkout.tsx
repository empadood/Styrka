import "./PostWorkout.css";

import { useState } from "react";

import { Button } from "../../components";
import { Input } from "../../components/input/Input";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { Span } from "../../components/text/Span";
import type { ProgressionResult } from "../../helpers/progression.helper";
import type { ExerciseName } from "../../types";

type Props = {
  results: ProgressionResult[];
  onConfirm: (finalIncrements: Record<ExerciseName, number>) => void;
};

export const PostWorkout = ({ results, onConfirm }: Props) => {
  const [increments, setIncrements] = useState<Record<ExerciseName, number>>(
    () =>
      Object.fromEntries(
        results
          .filter((result) => result.completed)
          .map((result) => [result.name, result.proposedIncrement]),
      ) as Record<ExerciseName, number>,
  );

  return (
    <div className="postworkout__container">
      {results.map((result) => (
        <div className="postworkout__exercise" key={result.name}>
          <ExerciseWithWeight
            exercise={result.name}
            weight={result.previousWeight}
          />
          {result.completed ? (
            <>
              <ExerciseWithWeight
                exercise={result.name}
                weight={result.previousWeight + increments[result.name]}
              />
              <div className="postworkout__increment">
                <Span text="Increment" size="small" />
                <Input
                  value={increments[result.name]}
                  onChange={(val) =>
                    setIncrements((prev) => ({
                      ...prev,
                      [result.name]: val,
                    }))
                  }
                />
              </div>
            </>
          ) : (
            <Span text="No increase — same weight next time" size="small" />
          )}
        </div>
      ))}
      <Button label="Confirm" onClick={() => onConfirm(increments)} />
    </div>
  );
};
