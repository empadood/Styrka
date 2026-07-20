import "./PostWorkout.css";

import { useState } from "react";

import { Button, Heading, Section } from "../../components";
import { Input } from "../../components/input/Input";
import { RpeScale } from "../../components/rpescale/RpeScale";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { Span } from "../../components/text/Span";
import { Weight } from "../../components/text/Weight";
import type { ProgressionResult } from "../../helpers/progression.helper";
import type { ExerciseName, SessionCheckIn } from "../../types";

type Props = {
  results: ProgressionResult[];
  onConfirm: (
    finalIncrements: Record<ExerciseName, number>,
    checkIn: SessionCheckIn,
  ) => void;
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
  const [rpe, setRpe] = useState(5);
  const [notes, setNotes] = useState("");

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
              <div className="postworkout__increment">
                <Span text="Increment" size="small" />
                <Input
                  value={increments[result.name]}
                  size="small"
                  onChange={(val) =>
                    setIncrements((prev) => ({
                      ...prev,
                      [result.name]: val,
                    }))
                  }
                />
              </div>
              <div className="postworkout__next">
                <Span text="Next session" size="small" />
                <Weight
                  weight={
                    Math.round(
                      (result.previousWeight + increments[result.name]) * 10,
                    ) / 10
                  }
                />
              </div>
            </>
          ) : (
            <div className="postworkout__no-increase">
              <Span text="No increase — same weight next time" size="small" />
            </div>
          )}
        </div>
      ))}

      <Section>
        <Heading text="How did it feel?" level="3" />
        <div className="postworkout__rpe">
          <Span text="Rate of perceived exertion" size="small" />
          <RpeScale value={rpe} onChange={setRpe} />
        </div>
        <textarea
          className="postworkout__notes"
          placeholder="What did you actually do, and how did it feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Section>

      <Button
        label="Confirm"
        onClick={() => onConfirm(increments, { rpe, notes })}
      />
    </div>
  );
};
