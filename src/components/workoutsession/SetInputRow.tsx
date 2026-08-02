import { useWeightUnit } from "../../hooks/useWeightUnit";
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
  onShowPlates: (weight: number) => void;
  variant?: "default" | "warmup";
  showWeightIndicator?: boolean;
  applyRounding?: boolean;
};

export const SetInputRow = ({
  label,
  targetRepsLabel,
  reps,
  weight,
  onRepsChange,
  onWeightChange,
  onShowPlates,
  variant = "default",
  showWeightIndicator = true,
  applyRounding = true,
}: Props) => {
  const { unit, label: unitLabel, toDisplay, toStorage } = useWeightUnit();
  const step = applyRounding ? undefined : null;

  return (
    <div
      className={`session__set ${variant === "warmup" ? "session__set--warmup" : ""}`}
    >
      <Span text={label} size="small" />
      <div className="session__set__inputs">
        <div className="session__input-group">
          <div className="session__input-label">
            <Span text={targetRepsLabel} size="small" />
          </div>
          <Input value={reps} size="medium" onChange={onRepsChange} />
        </div>
        <div className="session__input-group">
          <div className="session__input-label">
            <Span text={`Weight (${unit})`} size="small" />
          </div>
          <Row gap="sm" align="center">
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
        </div>
      </div>
    </div>
  );
};
