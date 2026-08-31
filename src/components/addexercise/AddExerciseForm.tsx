import "./AddExerciseForm.scss";

import { useState } from "react";

import { findCatalogEntry, getLastLoggedWeight } from "../../helpers/exercise-catalog.helper";
import type { ExerciseCatalogEntry, ExerciseId, WorkoutHistoryEntry } from "../../types";
import { Button } from "../button/Button";
import { SegmentedControl } from "../segmentedcontrol/SegmentedControl";
import { Stack } from "../stack/Stack";
import { AddExerciseFormOptions } from "./AddExerciseFormOptions";
import { ExercisePicker } from "./ExercisePicker";
import { ExerciseQuantityFields } from "./ExerciseQuantityFields";

export type ExerciseFormMode = "catalog" | "custom";

export type ExerciseFormSubmitInput = {
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
  onSubmit: (input: ExerciseFormSubmitInput) => void;
  showStartingWeight?: boolean;
  submitLabel?: string;
};

const MODE_OPTIONS: { value: ExerciseFormMode; label: string }[] = [
  { value: "catalog", label: "Pick from catalog" },
  { value: "custom", label: "Custom exercise" },
];

type ExerciseFormValues = {
  mode: ExerciseFormMode;
  selectedId: ExerciseId;
  customName: string;
  sets: number;
  reps: number;
  startingWeight: number;
  isBodyweight: boolean;
  showWeightIndicator: boolean;
  showWarmupSets: boolean;
};

type ExerciseFormUiState = {
  weightTouched: boolean;
  bodyweightTouched: boolean;
  lastResolvedId: ExerciseId | undefined;
};

export const AddExerciseForm = ({
  catalog,
  history = [],
  onSubmit,
  showStartingWeight = false,
  submitLabel = "Add exercise",
}: Props) => {
  const [formValues, setFormValues] = useState<ExerciseFormValues>({
    mode: "catalog",
    selectedId: catalog[0]?.id ?? "",
    customName: "",
    sets: 3,
    reps: 8,
    startingWeight: 0,
    isBodyweight: catalog[0]?.isBodyweight ?? false,
    showWeightIndicator: catalog[0]?.tracked ?? false,
    showWarmupSets: true,
  });
  const [uiState, setUiState] = useState<ExerciseFormUiState>({
    weightTouched: false,
    bodyweightTouched: false,
    lastResolvedId: catalog[0]?.id,
  });

  const trimmedCustomName = formValues.customName.trim().toLowerCase();
  const resolvedEntry =
    formValues.mode === "catalog"
      ? findCatalogEntry(catalog, formValues.selectedId)
      : catalog.find((entry) => entry.label.toLowerCase() === trimmedCustomName);
  const suggestedWeight = resolvedEntry ? getLastLoggedWeight(history, resolvedEntry.id) : null;
  const allowBodyweight = !(resolvedEntry?.tracked ?? false);

  if (resolvedEntry?.id !== uiState.lastResolvedId) {
    setUiState((prev) => ({ ...prev, lastResolvedId: resolvedEntry?.id }));
    if (showStartingWeight && !uiState.weightTouched) {
      setFormValues((prev) => ({ ...prev, startingWeight: suggestedWeight ?? 0 }));
    }
    if (!uiState.bodyweightTouched) {
      setFormValues((prev) => ({ ...prev, isBodyweight: resolvedEntry?.isBodyweight ?? false }));
    }
  }

  const handleSelectExercise = (id: ExerciseId) => {
    setFormValues((prev) => ({
      ...prev,
      selectedId: id,
      showWeightIndicator: catalog.find((entry) => entry.id === id)?.tracked ?? false,
    }));
    setUiState((prev) => ({ ...prev, weightTouched: false, bodyweightTouched: false }));
  };

  const handleModeChange = (nextMode: ExerciseFormMode) => {
    setFormValues((prev) => ({
      ...prev,
      mode: nextMode,
      showWeightIndicator:
        nextMode === "catalog"
          ? (catalog.find((entry) => entry.id === prev.selectedId)?.tracked ?? false)
          : false,
    }));
    setUiState((prev) => ({ ...prev, weightTouched: false, bodyweightTouched: false }));
  };

  const handleSubmit = () => {
    if (formValues.mode === "custom" && !formValues.customName.trim()) {
      return;
    }

    onSubmit({
      exerciseId: formValues.mode === "catalog" ? formValues.selectedId : undefined,
      customName: formValues.mode === "custom" ? formValues.customName : undefined,
      sets: formValues.sets,
      reps: formValues.reps,
      startingWeight: showStartingWeight ? formValues.startingWeight : undefined,
      showWeightIndicator: formValues.showWeightIndicator,
      showWarmupSets: formValues.showWarmupSets,
      isBodyweight: formValues.isBodyweight,
    });

    setFormValues((prev) => ({ ...prev, customName: "", sets: 3, reps: 8, startingWeight: 0 }));
    setUiState((prev) => ({ ...prev, weightTouched: false, bodyweightTouched: false }));
  };

  return (
    <Stack gap="md" className="add-exercise-form">
      <SegmentedControl
        options={MODE_OPTIONS}
        value={formValues.mode}
        onChange={handleModeChange}
      />

      <ExercisePicker
        mode={formValues.mode}
        catalog={catalog}
        selectedId={formValues.selectedId}
        customName={formValues.customName}
        onSelectExercise={handleSelectExercise}
        onCustomNameChange={(customName) => setFormValues((prev) => ({ ...prev, customName }))}
      />

      <ExerciseQuantityFields
        sets={formValues.sets}
        reps={formValues.reps}
        startingWeight={formValues.startingWeight}
        isBodyweight={formValues.isBodyweight}
        showStartingWeight={showStartingWeight}
        suggestedWeight={suggestedWeight}
        weightTouched={uiState.weightTouched}
        onSetsChange={(sets) => setFormValues((prev) => ({ ...prev, sets }))}
        onRepsChange={(reps) => setFormValues((prev) => ({ ...prev, reps }))}
        onWeightChange={(storageValue) => {
          setUiState((prev) => ({ ...prev, weightTouched: true }));
          setFormValues((prev) => ({ ...prev, startingWeight: storageValue }));
        }}
      />

      <AddExerciseFormOptions
        allowBodyweight={allowBodyweight}
        isBodyweight={formValues.isBodyweight}
        showWeightIndicator={formValues.showWeightIndicator}
        showWarmupSets={formValues.showWarmupSets}
        onBodyweightChange={(checked) => {
          setUiState((prev) => ({ ...prev, bodyweightTouched: true }));
          setFormValues((prev) => ({ ...prev, isBodyweight: checked }));
        }}
        onShowWeightIndicatorChange={(checked) =>
          setFormValues((prev) => ({ ...prev, showWeightIndicator: checked }))
        }
        onShowWarmupSetsChange={(checked) =>
          setFormValues((prev) => ({ ...prev, showWarmupSets: checked }))
        }
      />

      <Button label={submitLabel} onClick={handleSubmit} />
    </Stack>
  );
};
