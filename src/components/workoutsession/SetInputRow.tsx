import { useWeightUnit } from "../../hooks/useWeightUnit";
import { Field } from "../field/Field";
import { Input } from "../input/Input";
import { PlateIndicator } from "../platebreakdown/PlateIndicator";
import { Row } from "../row/Row";
import { Span } from "../text/Span";

type Props = {
  label: string;
  targetRepsLabel: string;
  reps: number;
  weight: number;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onRepsBlur?: () => void;
  onShowPlates: (weight: number) => void;
  variant?: "default" | "warmup";
  showWeightIndicator?: boolean;
  applyRounding?: boolean;
  isBodyweight?: boolean;
};

export const SetInputRow = ({
  label,
  targetRepsLabel,
  reps,
  weight,
  onRepsChange,
  onWeightChange,
  onRepsBlur,
  onShowPlates,
  variant = "default",
  showWeightIndicator = true,
  applyRounding = true,
  isBodyweight = false,
}: Props) => {
  const { unit, label: unitLabel, toDisplay, toStorage } = useWeightUnit();
  const step = applyRounding ? undefined : null;

  return (
    <div
      className={`session__set ${variant === "warmup" ? "session__set--warmup" : ""}`}
    >
      <Span text={label} size="small" />
      <div className="session__set__inputs">
        <Field as="div" label={targetRepsLabel}>
          <Input value={reps} size="medium" onChange={onRepsChange} onBlur={onRepsBlur} />
        </Field>
        <Field as="div" label={isBodyweight ? `Added weight (${unit})` : `Weight (${unit})`}>
          <Row gap="sm" align="center">
            {isBodyweight && <Span text="BW +" size="small" />}
            <Input
              size="medium"
              value={toDisplay(weight, step)}
              onChange={(value) => onWeightChange(toStorage(value, step))}
            />
            {showWeightIndicator && (
              <PlateIndicator
                weight={weight}
                ariaLabel={`Show plates for ${toDisplay(weight, step)} ${unitLabel}`}
                onClick={() => onShowPlates(weight)}
              />
            )}
          </Row>
        </Field>
      </div>
    </div>
  );
};
