import { Field } from "../field/Field";
import { Row } from "../row/Row";

type Props = {
  allowBodyweight: boolean;
  isBodyweight: boolean;
  showWeightIndicator: boolean;
  showWarmupSets: boolean;
  onBodyweightChange: (checked: boolean) => void;
  onShowWeightIndicatorChange: (checked: boolean) => void;
  onShowWarmupSetsChange: (checked: boolean) => void;
};

export const AddExerciseFormOptions = ({
  allowBodyweight,
  isBodyweight,
  showWeightIndicator,
  showWarmupSets,
  onBodyweightChange,
  onShowWeightIndicatorChange,
  onShowWarmupSetsChange,
}: Props) => (
  <Row gap="sm" justify="start" className="add-exercise-form__checkboxes">
    {allowBodyweight && (
      <Field label="Body weight exercise" controlFirst>
        <input
          type="checkbox"
          checked={isBodyweight}
          onChange={(e) => onBodyweightChange(e.target.checked)}
        />
      </Field>
    )}

    <Field label="Show weight indicator" controlFirst>
      <input
        type="checkbox"
        checked={showWeightIndicator}
        onChange={(e) => onShowWeightIndicatorChange(e.target.checked)}
      />
    </Field>

    <Field label="Show warm-up sets" controlFirst>
      <input
        type="checkbox"
        checked={showWarmupSets}
        onChange={(e) => onShowWarmupSetsChange(e.target.checked)}
      />
    </Field>
  </Row>
);
