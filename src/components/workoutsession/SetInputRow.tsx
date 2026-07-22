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
}: Props) => (
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
          <Span text="Weight (kg)" size="small" />
        </div>
        <Row gap="sm" align="center">
          <Input size="medium" value={weight} onChange={onWeightChange} />
          <PlateIndicator
            weight={weight}
            ariaLabel={`Show plates for ${weight} kg`}
            onClick={() => onShowPlates(weight)}
          />
        </Row>
      </div>
    </div>
  </div>
);
