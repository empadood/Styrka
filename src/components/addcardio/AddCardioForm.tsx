import "./AddCardioForm.scss";

import { useState } from "react";

import { CARDIO_ACTIVITY, CARDIO_ACTIVITY_LABELS, type CardioActivityId } from "../../types";
import { Button } from "../button/Button";
import { Field } from "../field/Field";
import { Select } from "../select/Select";

type Props = {
  onSubmit: (activityId: CardioActivityId) => void;
};

const ACTIVITY_IDS = Object.values(CARDIO_ACTIVITY);

export const AddCardioForm = ({ onSubmit }: Props) => {
  const [activityId, setActivityId] = useState<CardioActivityId>(ACTIVITY_IDS[0]);

  return (
    <div className="add-cardio-form">
      <Field label="Activity">
        <Select value={activityId} onChange={(value) => setActivityId(value as CardioActivityId)}>
          {ACTIVITY_IDS.map((id) => (
            <option key={id} value={id}>
              {CARDIO_ACTIVITY_LABELS[id]}
            </option>
          ))}
        </Select>
      </Field>
      <Button label="Add cardio" onClick={() => onSubmit(activityId)} />
    </div>
  );
};
