import "./AddCardioForm.scss";

import { useState } from "react";

import { CARDIO_ACTIVITY, CARDIO_ACTIVITY_LABELS, type CardioActivityId } from "../../types";
import { Button } from "../button/Button";
import { Span } from "../text/Span";

type Props = {
  onSubmit: (activityId: CardioActivityId) => void;
};

const ACTIVITY_IDS = Object.values(CARDIO_ACTIVITY);

export const AddCardioForm = ({ onSubmit }: Props) => {
  const [activityId, setActivityId] = useState<CardioActivityId>(ACTIVITY_IDS[0]);

  return (
    <div className="add-cardio-form">
      <label className="add-cardio-form__field">
        <Span text="Activity" size="small" />
        <select
          className="add-cardio-form__select"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value as CardioActivityId)}
        >
          {ACTIVITY_IDS.map((id) => (
            <option key={id} value={id}>
              {CARDIO_ACTIVITY_LABELS[id]}
            </option>
          ))}
        </select>
      </label>
      <Button label="Add cardio" onClick={() => onSubmit(activityId)} />
    </div>
  );
};
