import { ROUNDING_STEPS, type RoundingStep, type WeightUnit } from "../../helpers/weight-unit.helper";
import { SectionCard } from "../sectioncard/SectionCard";
import { SegmentedControl } from "../segmentedcontrol/SegmentedControl";
import { Span } from "../text/Span";

type Props = {
  weightUnit: WeightUnit;
  onChangeWeightUnit: (unit: WeightUnit) => void;
  weightRounding: Record<WeightUnit, RoundingStep>;
  onChangeRounding: (unit: WeightUnit, step: RoundingStep) => void;
};

const UNIT_OPTIONS: { value: WeightUnit; label: string }[] = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "lbs", label: "Pounds (lbs)" },
];

const ROUNDING_OPTIONS = ROUNDING_STEPS.map((step) => ({ value: step, label: String(step) }));

export const UnitsSection = ({
  weightUnit,
  onChangeWeightUnit,
  weightRounding,
  onChangeRounding,
}: Props) => (
  <SectionCard title="Units" description="Choose which unit weights are shown and entered in.">
    <SegmentedControl options={UNIT_OPTIONS} value={weightUnit} onChange={onChangeWeightUnit} />

    <Span text="Round kg values to nearest" size="small" />
    <SegmentedControl
      options={ROUNDING_OPTIONS}
      value={weightRounding.kg}
      onChange={(step) => onChangeRounding("kg", step)}
    />

    <Span text="Round lbs values to nearest" size="small" />
    <SegmentedControl
      options={ROUNDING_OPTIONS}
      value={weightRounding.lbs}
      onChange={(step) => onChangeRounding("lbs", step)}
    />
  </SectionCard>
);
