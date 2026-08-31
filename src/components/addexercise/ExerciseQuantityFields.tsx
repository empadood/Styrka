import { useWeightUnit } from "../../hooks/useWeightUnit";
import { Field } from "../field/Field";
import { Input } from "../input/Input";
import { Row } from "../row/Row";
import { Span } from "../text/Span";

type Props = {
  sets: number;
  reps: number;
  startingWeight: number;
  isBodyweight: boolean;
  showStartingWeight: boolean;
  suggestedWeight: number | null;
  weightTouched: boolean;
  onSetsChange: (sets: number) => void;
  onRepsChange: (reps: number) => void;
  onWeightChange: (storageValue: number) => void;
};

export const ExerciseQuantityFields = ({
  sets,
  reps,
  startingWeight,
  isBodyweight,
  showStartingWeight,
  suggestedWeight,
  weightTouched,
  onSetsChange,
  onRepsChange,
  onWeightChange,
}: Props) => {
  const { unit, toDisplay, toStorage } = useWeightUnit();

  return (
    <>
      <Row gap="md">
        <Field label="Sets">
          <Input value={sets} onChange={onSetsChange} size="small" />
        </Field>
        <Field label="Reps">
          <Input value={reps} onChange={onRepsChange} size="small" />
        </Field>
        {showStartingWeight && (
          <Field label={isBodyweight ? `Added weight (${unit})` : `Weight (${unit})`}>
            <Input
              value={toDisplay(startingWeight)}
              onChange={(value) => onWeightChange(toStorage(value))}
              size="small"
            />
          </Field>
        )}
      </Row>

      {showStartingWeight && suggestedWeight !== null && !weightTouched && (
        <Span
          text={`Prefilled from your last session: ${toDisplay(suggestedWeight)} ${unit}`}
          size="small"
          tone="secondary"
        />
      )}
    </>
  );
};
