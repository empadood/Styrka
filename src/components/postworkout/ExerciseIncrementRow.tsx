import type { ProgressionResult } from "../../helpers/progression.helper";
import { Field } from "../field/Field";
import { Input } from "../input/Input";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";
import { Span } from "../text/Span";
import { Weight } from "../text/Weight";

type Props = {
  result: ProgressionResult;
  increment: number | undefined;
  onIncrementChange: (value: number) => void;
};

export const ExerciseIncrementRow = ({ result, increment, onIncrementChange }: Props) => (
  <div className="postworkout__exercise">
    <ExerciseWithWeight label={result.label} weight={result.previousWeight} />
    {!result.tracked ? (
      <div className="postworkout__no-increase">
        <Span text="Logged — no auto progression for this exercise" size="small" />
      </div>
    ) : result.completed ? (
      <>
        <Field as="div" label="Increment" className="postworkout__increment">
          <Input value={increment ?? 0} size="small" onChange={onIncrementChange} />
        </Field>
        <Field as="div" label="Next session" className="postworkout__next">
          <Weight weight={Math.round((result.previousWeight + (increment ?? 0)) * 10) / 10} />
        </Field>
      </>
    ) : (
      <div className="postworkout__no-increase">
        <Span text="No increase — same weight next time" size="small" />
      </div>
    )}
  </div>
);
