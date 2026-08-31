import { Plus } from "lucide-react";

import type { CardioActivityId, ExerciseCatalogEntry, WorkoutHistoryEntry } from "../../types";
import { AddCardioForm } from "../addcardio/AddCardioForm";
import { AddExerciseForm, type ExerciseFormSubmitInput } from "../addexercise/AddExerciseForm";
import { Expandable } from "../expandable/Expandable";
import { Stack } from "../stack/Stack";

type Props = {
  catalog: ExerciseCatalogEntry[];
  history: WorkoutHistoryEntry[];
  onAddCardio: (activityId: CardioActivityId) => void;
  onAddExercise: (input: ExerciseFormSubmitInput) => void;
};

export const AddToWorkoutSection = ({ catalog, history, onAddCardio, onAddExercise }: Props) => (
  <Stack gap="sm" className="session__add-section">
    <Expandable icon={Plus} label="Add cardio">
      <AddCardioForm onSubmit={onAddCardio} />
    </Expandable>
    <Expandable icon={Plus} label="Add exercise">
      <AddExerciseForm
        catalog={catalog}
        history={history}
        onSubmit={onAddExercise}
        showStartingWeight
        submitLabel="Add exercise to this workout"
      />
    </Expandable>
  </Stack>
);
