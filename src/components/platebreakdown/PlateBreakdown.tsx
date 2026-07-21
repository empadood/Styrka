import "./PlateBreakdown.scss";

import { calculatePlateBreakdown, PLATE_STYLES } from "../../helpers/plate-calculator.helper";
import { Row } from "../row/Row";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";

type Props = {
  weight: number;
};

export const PlateBreakdown = ({ weight }: Props) => {
  const breakdown = calculatePlateBreakdown(weight);
  const plates = breakdown.perSide.flatMap((plate) =>
    Array.from({ length: plate.count }, () => plate.weight),
  );

  return (
    <Stack gap="md" className="plate-breakdown">
      <div className="plate-visual">
        <div className="plate-visual__bar" aria-hidden="true" />
        {plates.map((plateWeight, index) => {
          const style = PLATE_STYLES[plateWeight as keyof typeof PLATE_STYLES];
          return (
            <div
              key={index}
              className={`plate plate--${style.size} plate--${style.color}`}
            >
              <span>{plateWeight}</span>
            </div>
          );
        })}
      </div>
      {plates.length === 0 && <Span text="Just the bar — no plates needed." size="small" />}
      <Row justify="between" className="plate-breakdown__total">
        <Span text="Total" size="small" />
        <Span text={`${breakdown.totalPlatedWeight} kg`} size="small" />
      </Row>
      {breakdown.remainderKg > 0 && (
        <Span
          text={`Can't be made exactly with these plates — ${breakdown.remainderKg.toFixed(2)} kg short.`}
          size="small"
        />
      )}
    </Stack>
  );
};
