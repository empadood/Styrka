import "./SetupOneRepMax.scss";

import { useState } from "react";

import { Button, Heading, Input, Span } from "../../components";
import { useWeightUnit } from "../../hooks/useWeightUnit";
import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";

type Props = {
  onComplete: (estimatedOneRepMax: Record<TrackedLiftId, number>) => void;
};

const EXERCISES = Object.values(EXERCISE);

const INITIAL_ONE_REP_MAX: Record<TrackedLiftId, number> = {
  benchpress: 60,
  deadlift: 100,
  ohp: 40,
  squat: 80,
};

export const SetupOneRepMax = ({ onComplete }: Props) => {
  const { unit, toDisplay, toStorage } = useWeightUnit();
  const [estimatedOneRepMax, setEstimatedOneRepMax] = useState(
    INITIAL_ONE_REP_MAX,
  );
  const [error, setError] = useState("");

  const updateOneRepMax = (exercise: TrackedLiftId, displayValue: number) => {
    setEstimatedOneRepMax((previousOneRepMax) => ({
      ...previousOneRepMax,
      [exercise]: toStorage(displayValue),
    }));
  };

  const completeSetup = () => {
    if (EXERCISES.some((exercise) => estimatedOneRepMax[exercise] <= 0)) {
      setError(`Enter an estimated 1RM above 0 ${unit} for each lift.`);
      return;
    }

    onComplete(estimatedOneRepMax);
  };

  return (
    <section className="setup-one-rep-max">
      <div>
        <Span text="Welcome to Styrka" size="small" />
        <Heading text="Set your estimated 1RM" level="1" />
        <p>
          We’ll use 70% of each estimate as your starting training weight and
          round it to the nearest 2.5 kg.
        </p>
      </div>
      <div className="setup-one-rep-max__lifts">
        {EXERCISES.map((exercise) => (
          <label className="setup-one-rep-max__lift" key={exercise}>
            <Span text={EXERCISE_LABELS[exercise]} />
            <div>
              <Input
                value={toDisplay(estimatedOneRepMax[exercise])}
                onChange={(value) => updateOneRepMax(exercise, value)}
                size="large"
              />
              <Span text={unit} size="small" />
            </div>
          </label>
        ))}
      </div>
      {error && <p className="setup-one-rep-max__error">{error}</p>}
      <Button label="Save and view workout" onClick={completeSetup} />
    </section>
  );
};
