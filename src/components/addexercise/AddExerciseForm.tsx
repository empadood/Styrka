import "./AddExerciseForm.scss";

import { useState } from "react";

import type { ExerciseCatalogEntry, ExerciseId } from "../../types";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { Row } from "../row/Row";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";
import { TextField } from "../textfield/TextField";

type SubmitInput = {
  exerciseId?: ExerciseId;
  customName?: string;
  sets: number;
  reps: number;
  startingWeight?: number;
  showWeightIndicator: boolean;
  showWarmupSets: boolean;
};

type Props = {
  catalog: ExerciseCatalogEntry[];
  onSubmit: (input: SubmitInput) => void;
  showStartingWeight?: boolean;
  submitLabel?: string;
};

export const AddExerciseForm = ({
  catalog,
  onSubmit,
  showStartingWeight = false,
  submitLabel = "Add exercise",
}: Props) => {
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? "");
  const [customName, setCustomName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [startingWeight, setStartingWeight] = useState(0);
  const [showWeightIndicator, setShowWeightIndicator] = useState(
    catalog[0]?.tracked ?? false,
  );
  const [showWarmupSets, setShowWarmupSets] = useState(true);

  const trackedLifts = catalog.filter((entry) => entry.tracked);
  const accessories = catalog.filter((entry) => !entry.tracked);

  const handleSelectExercise = (id: ExerciseId) => {
    setSelectedId(id);
    setShowWeightIndicator(catalog.find((entry) => entry.id === id)?.tracked ?? false);
  };

  const handleModeChange = (nextMode: "catalog" | "custom") => {
    setMode(nextMode);
    setShowWeightIndicator(
      nextMode === "catalog" ? (catalog.find((entry) => entry.id === selectedId)?.tracked ?? false) : false,
    );
  };

  const handleSubmit = () => {
    if (mode === "custom" && !customName.trim()) {
      return;
    }

    onSubmit({
      exerciseId: mode === "catalog" ? selectedId : undefined,
      customName: mode === "custom" ? customName : undefined,
      sets,
      reps,
      startingWeight: showStartingWeight ? startingWeight : undefined,
      showWeightIndicator,
      showWarmupSets,
    });

    setCustomName("");
    setSets(3);
    setReps(8);
    setStartingWeight(0);
  };

  return (
    <Stack gap="md" className="add-exercise-form">
      <Row gap="sm" className="add-exercise-form__mode">
        <Button
          label="Pick from catalog"
          variant={mode === "catalog" ? "primary" : "secondary"}
          onClick={() => handleModeChange("catalog")}
        />
        <Button
          label="Custom exercise"
          variant={mode === "custom" ? "primary" : "secondary"}
          onClick={() => handleModeChange("custom")}
        />
      </Row>

      {mode === "catalog" ? (
        <label className="add-exercise-form__field">
          <Span text="Exercise" size="small" />
          <select
            className="add-exercise-form__select"
            value={selectedId}
            onChange={(e) => handleSelectExercise(e.target.value)}
          >
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
          </select>
        </label>
      ) : (
        <label className="add-exercise-form__field">
          <Span text="Exercise name" size="small" />
          <TextField
            value={customName}
            onChange={setCustomName}
            placeholder="e.g. Cable crossover"
            size="medium"
          />
        </label>
      )}

      <Row gap="md" className="add-exercise-form__row">
        <label className="add-exercise-form__field">
          <Span text="Sets" size="small" />
          <Input value={sets} onChange={setSets} size="small" />
        </label>
        <label className="add-exercise-form__field">
          <Span text="Reps" size="small" />
          <Input value={reps} onChange={setReps} size="small" />
        </label>
        {showStartingWeight && (
          <label className="add-exercise-form__field">
            <Span text="Weight (kg)" size="small" />
            <Input
              value={startingWeight}
              onChange={setStartingWeight}
              size="small"
            />
          </label>
        )}
      </Row>

      <Row gap="sm" justify="start" className="add-exercise-form__checkboxes">
        <label className="add-exercise-form__checkbox">
          <input
            type="checkbox"
            checked={showWeightIndicator}
            onChange={(e) => setShowWeightIndicator(e.target.checked)}
          />
          <Span text="Show weight indicator" size="small" />
        </label>

        <label className="add-exercise-form__checkbox">
          <input
            type="checkbox"
            checked={showWarmupSets}
            onChange={(e) => setShowWarmupSets(e.target.checked)}
          />
          <Span text="Show warm-up sets" size="small" />
        </label>
      </Row>

      <Button label={submitLabel} onClick={handleSubmit} />
    </Stack>
  );
};
