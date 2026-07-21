import "./OneRepMax.scss";

import { Button, Heading, Row, Stack } from "../../components";
import { Span } from "../../components/text/Span";
import { Weight } from "../../components/text/Weight";
import type { OneRepMaxResult } from "../../helpers/one-rep-max.helper";

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
    <Stack gap="lg" className="onerepmax__container">
      <Heading text="Estimated One Rep Max" />
      {results.map((result) => (
        <Row justify="between" className="onerepmax__exercise" key={result.exerciseId}>
          <Span text={result.label} capitalize />
          {result.oneRepMax !== null ? (
            <Row gap="sm" className="onerepmax__values">
              <Weight weight={Math.round(result.oneRepMax * 10) / 10} />
              <Difference result={result} />
            </Row>
          ) : (
            <Span text="No reps logged" size="small" />
          )}
        </Row>
      ))}
      <Button label="Continue" onClick={onContinue} />
    </Stack>
  );
};
