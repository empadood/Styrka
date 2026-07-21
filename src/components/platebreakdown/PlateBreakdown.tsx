import "./PlateBreakdown.scss";

import { calculatePlateBreakdown } from "../../helpers/plate-calculator.helper";
import { Row } from "../row/Row";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";

type Props = {
  weight: number;
};

export const PlateBreakdown = ({ weight }: Props) => {
  const breakdown = calculatePlateBreakdown(weight);

  return (
    <Stack gap="sm" className="plate-breakdown">
      <Row justify="between">
        <Span text="Bar" size="small" />
        <Span text={`${breakdown.barWeight} kg`} size="small" />
      </Row>
      {breakdown.perSide.length === 0 ? (
        <Span text="No plates needed per side." size="small" />
      ) : (
        breakdown.perSide.map((plate) => (
          <Row justify="between" key={plate.weight}>
            <Span text={`${plate.weight} kg × ${plate.count} (per side)`} size="small" />
          </Row>
        ))
      )}
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
