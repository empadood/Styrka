import type { ExerciseCatalogEntry, ExerciseId } from "../../types";
import { Field } from "../field/Field";
import { Select } from "../select/Select";
import { TextField } from "../textfield/TextField";
import type { ExerciseFormMode } from "./AddExerciseForm";

type Props = {
  mode: ExerciseFormMode;
  catalog: ExerciseCatalogEntry[];
  selectedId: ExerciseId;
  customName: string;
  onSelectExercise: (id: ExerciseId) => void;
  onCustomNameChange: (name: string) => void;
};

export const ExercisePicker = ({
  mode,
  catalog,
  selectedId,
  customName,
  onSelectExercise,
  onCustomNameChange,
}: Props) => {
  const trackedLifts = catalog.filter((entry) => entry.tracked);
  const accessories = catalog.filter((entry) => !entry.tracked);

  return mode === "catalog" ? (
    <Field label="Exercise">
      <Select className="add-exercise-form__select" value={selectedId} onChange={onSelectExercise}>
        {trackedLifts.length > 0 && (
          <optgroup label="Tracked lifts">
            {trackedLifts.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </optgroup>
        )}
        {accessories.length > 0 && (
          <optgroup label="Accessories">
            {accessories.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </optgroup>
        )}
      </Select>
    </Field>
  ) : (
    <Field label="Exercise name">
      <TextField
        value={customName}
        onChange={onCustomNameChange}
        placeholder="e.g. Cable crossover"
        size="medium"
      />
    </Field>
  );
};
