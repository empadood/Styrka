import "./AddExerciseForm.scss";

import { useState } from "react";

import { findCatalogEntry, getLastLoggedWeight, resolveCustomExercise } from "../../helpers/exercise-catalog.helper";
import { useWeightUnit } from "../../hooks/useWeightUnit";
import type { ExerciseCatalogEntry, ExerciseId, WorkoutHistoryEntry } from "../../types";
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
  isBodyweight: boolean;
};

type Props = {
  catalog: ExerciseCatalogEntry[];
  history?: WorkoutHistoryEntry[];
  onSubmit: (input: SubmitInput) => void;
  showStartingWeight?: boolean;
  submitLabel?: string;
};

export const AddExerciseForm = ({
  catalog,
  history = [],
  onSubmit,
  showStartingWeight = false,
  submitLabel = "Add exercise",
}: Props) => {
  const { unit, toDisplay, toStorage } = useWeightUnit();
  const [mode, setMode] = useState<"catalog" | "custom">("catalog");
  const [selectedId, setSelectedId] = useState(catalog[0]?.id ?? "");
  const [customName, setCustomName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(8);
  const [startingWeight, setStartingWeight] = useState(0);
  const [weightTouched, setWeightTouched] = useState(false);
  const [showWeightIndicator, setShowWeightIndicator] = useState(
    catalog[0]?.tracked ?? false,
  );
  const [showWarmupSets, setShowWarmupSets] = useState(true);
  const [isBodyweight, setIsBodyweight] = useState(catalog[0]?.isBodyweight ?? false);
  const [bodyweightTouched, setBodyweightTouched] = useState(false);

  const trackedLifts = catalog.filter((entry) => entry.tracked);
  const accessories = catalog.filter((entry) => !entry.tracked);

  const resolvedEntry =
    mode === "catalog"
      ? findCatalogEntry(catalog, selectedId)
      : customName.trim()
        ? resolveCustomExercise(catalog, customName)
        : undefined;
  const suggestedWeight = resolvedEntry ? getLastLoggedWeight(history, resolvedEntry.id) : null;
  const allowBodyweight = !(resolvedEntry?.tracked ?? false);

  const [lastResolvedId, setLastResolvedId] = useState(resolvedEntry?.id);
  if (resolvedEntry?.id !== lastResolvedId) {
    setLastResolvedId(resolvedEntry?.id);
    if (showStartingWeight && !weightTouched) {
      setStartingWeight(suggestedWeight ?? 0);
    }
    if (!bodyweightTouched) {
      setIsBodyweight(resolvedEntry?.isBodyweight ?? false);
    }
  }

  const handleSelectExercise = (id: ExerciseId) => {
    setSelectedId(id);
    setShowWeightIndicator(catalog.find((entry) => entry.id === id)?.tracked ?? false);
    setWeightTouched(false);
    setBodyweightTouched(false);
  };

  const handleModeChange = (nextMode: "catalog" | "custom") => {
    setMode(nextMode);
    setShowWeightIndicator(
      nextMode === "catalog" ? (catalog.find((entry) => entry.id === selectedId)?.tracked ?? false) : false,
    );
    setWeightTouched(false);
    setBodyweightTouched(false);
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
      isBodyweight,
    });

    setCustomName("");
    setSets(3);
    setReps(8);
    setStartingWeight(0);
    setWeightTouched(false);
    setBodyweightTouched(false);
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
            <Span text={isBodyweight ? `Added weight (${unit})` : `Weight (${unit})`} size="small" />
            <Input
              value={toDisplay(startingWeight)}
              onChange={(value) => {
                setWeightTouched(true);
                setStartingWeight(toStorage(value));
              }}
              size="small"
            />
          </label>
        )}
      </Row>

      {showStartingWeight && suggestedWeight !== null && !weightTouched && (
        <Span
          text={`Prefilled from your last session: ${toDisplay(suggestedWeight)} ${unit}`}
          size="small"
          tone="secondary"
        />
      )}

      <Row gap="sm" justify="start" className="add-exercise-form__checkboxes">
        {allowBodyweight && (
          <label className="add-exercise-form__checkbox">
            <input
              type="checkbox"
              checked={isBodyweight}
              onChange={(e) => {
                setBodyweightTouched(true);
                setIsBodyweight(e.target.checked);
              }}
            />
            <Span text="Body weight exercise" size="small" />
          </label>
        )}

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
