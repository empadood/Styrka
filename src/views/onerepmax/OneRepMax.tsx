import "./OneRepMax.css";

import { Button, Heading } from "../../components";
import { Span } from "../../components/text/Span";
import { Weight } from "../../components/text/Weight";
import type { OneRepMaxResult } from "../../helpers/one-rep-max.helper";
import { EXERCISE_LABELS } from "../../types";

type Props = {
  results: OneRepMaxResult[];
  onContinue: () => void;
};

const formatSignedWeight = (difference: number): string => {
  const rounded = Math.round(difference * 10) / 10 || 0;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded}`;
};

const Difference = ({ result }: { result: OneRepMaxResult }) => {
  if (result.difference === null) {
    return (
      <Span
        text={result.previousOneRepMax === null ? "New" : "—"}
        size="small"
      />
    );
  }

  return (
    <Weight weight={formatSignedWeight(result.difference)} size="small" />
  );
};

export const OneRepMax = ({ results, onContinue }: Props) => {
  return (
    <div className="onerepmax__container">
      <Heading text="Estimated One Rep Max" />
      {results.map((result) => (
        <div className="onerepmax__exercise" key={result.name}>
          <Span text={EXERCISE_LABELS[result.name]} capitalize />
          {result.oneRepMax !== null ? (
            <div className="onerepmax__values">
              <Weight weight={Math.round(result.oneRepMax * 10) / 10} />
              <Difference result={result} />
            </div>
          ) : (
            <Span text="No reps logged" size="small" />
          )}
        </div>
      ))}
      <Button label="Continue" onClick={onContinue} />
    </div>
  );
};
