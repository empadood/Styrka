import { ROUNDING_STEPS, type RoundingStep, type WeightUnit } from "../../helpers/weight-unit.helper";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  weightUnit: WeightUnit;
  onChangeWeightUnit: (unit: WeightUnit) => void;
  weightRounding: Record<WeightUnit, RoundingStep>;
  onChangeRounding: (unit: WeightUnit, step: RoundingStep) => void;
};

export const UnitsSection = ({
  weightUnit,
  onChangeWeightUnit,
  weightRounding,
  onChangeRounding,
}: Props) => (
  <Card>
    <Heading text="Units" />
    <Span text="Choose which unit weights are shown and entered in." size="small" />
    <Row gap="sm" className="profile__units">
      <Button
        label="Kilograms (kg)"
        variant={weightUnit === "kg" ? "primary" : "secondary"}
        onClick={() => onChangeWeightUnit("kg")}
      />
      <Button
        label="Pounds (lbs)"
        variant={weightUnit === "lbs" ? "primary" : "secondary"}
        onClick={() => onChangeWeightUnit("lbs")}
      />
    </Row>

    <Span text="Round kg values to nearest" size="small" />
    <Row gap="sm" className="profile__units">
      {ROUNDING_STEPS.map((step) => (
        <Button
          key={`kg-${step}`}
          label={String(step)}
          variant={weightRounding.kg === step ? "primary" : "secondary"}
          onClick={() => onChangeRounding("kg", step)}
        />
      ))}
    </Row>

    <Span text="Round lbs values to nearest" size="small" />
    <Row gap="sm" className="profile__units">
      {ROUNDING_STEPS.map((step) => (
        <Button
          key={`lbs-${step}`}
          label={String(step)}
          variant={weightRounding.lbs === step ? "primary" : "secondary"}
          onClick={() => onChangeRounding("lbs", step)}
        />
      ))}
    </Row>
  </Card>
);
