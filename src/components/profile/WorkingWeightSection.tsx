import { useState } from "react";

import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Input } from "../input/Input";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
};

export const WorkingWeightSection = ({ workingWeights, onOverrideWeight }: Props) => {
  const [drafts, setDrafts] = useState<Record<TrackedLiftId, number>>(workingWeights);

  return (
    <Card>
      <Heading text="Current Working Weight" />
      <Span
        text="Lower a weight to reduce next session's starting point — for deloads, bad sessions, or illness."
        size="small"
      />
      <div className="profile__configure profile__configure--editable">
        {Object.values(EXERCISE).map((exercise) => (
          <Row justify="between" className="profile__weight-row" key={exercise}>
            <Span text={EXERCISE_LABELS[exercise]} capitalize />
            <Row gap="sm" className="profile__weight-edit">
              <Input
                value={drafts[exercise]}
                size="small"
                onChange={(value) => setDrafts((prev) => ({ ...prev, [exercise]: value }))}
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
    </Card>
  );
};
