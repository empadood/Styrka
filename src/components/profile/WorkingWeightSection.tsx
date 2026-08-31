import { useState } from "react";

import { useWeightUnit } from "../../hooks/useWeightUnit";
import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { Button } from "../button/Button";
import { Input } from "../input/Input";
import { Row } from "../row/Row";
import { SectionCard } from "../sectioncard/SectionCard";
import { Span } from "../text/Span";

type Props = {
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
};

export const WorkingWeightSection = ({ workingWeights, onOverrideWeight }: Props) => {
  const [drafts, setDrafts] = useState<Record<TrackedLiftId, number>>(workingWeights);
  const { toDisplay, toStorage } = useWeightUnit();

  return (
    <SectionCard
      title="Current Working Weight"
      description="Lower a weight to reduce next session's starting point — for deloads, bad sessions, or illness."
    >
      <div className="profile__configure profile__configure--editable">
        {Object.values(EXERCISE).map((exercise) => (
          <Row justify="between" className="profile__weight-row" key={exercise}>
            <Span text={EXERCISE_LABELS[exercise]} capitalize />
            <Row gap="sm" className="profile__weight-edit">
              <Input
                value={toDisplay(drafts[exercise])}
                size="small"
                onChange={(value) =>
                  setDrafts((prev) => ({ ...prev, [exercise]: toStorage(value) }))
                }
              />
              <Button
                label="Save"
                variant="secondary"
                onClick={() => onOverrideWeight(exercise, drafts[exercise])}
              />
            </Row>
          </Row>
        ))}
      </div>
    </SectionCard>
  );
};
