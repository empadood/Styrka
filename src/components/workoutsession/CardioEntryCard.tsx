import { Pause, Play, Square, Trash2 } from "lucide-react";

import type { LoggedCardioSession } from "../../types";
import { Button } from "../button/Button";
import { CardioTimerDisplay } from "../cardiotimer/CardioTimerDisplay";
import { Input } from "../input/Input";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  entry: LoggedCardioSession;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onSave: () => void;
  onKcalChange: (value: number) => void;
  onRemove: () => void;
};

export const CardioEntryCard = ({
  entry,
  onStart,
  onPause,
  onStop,
  onSave,
  onKcalChange,
  onRemove,
}: Props) => (
  <section className="session__exercise session__cardio">
    <Row justify="between" className="session__exercise-header">
      <Heading text={entry.label} level="3" />
      <Button
        icon={Trash2}
        variant="danger"
        size="icon"
        ariaLabel={`Remove ${entry.label}`}
        onClick={onRemove}
      />
    </Row>
    <div className="session__cardio-timer-block">
      <CardioTimerDisplay entry={entry} />
      {!entry.isFinished && (
        <Row gap="sm" justify="start" align="center" className="session__cardio-buttons">
          <Button
            icon={entry.isRunning ? Pause : Play}
            variant={entry.isRunning ? "secondary" : "primary"}
            size="icon"
            ariaLabel={entry.isRunning ? `Pause ${entry.label}` : `Start ${entry.label}`}
            onClick={entry.isRunning ? onPause : onStart}
          />
          <Button
            icon={Square}
            variant="secondary"
            size="icon"
            ariaLabel={`Stop ${entry.label}`}
            onClick={onStop}
          />
        </Row>
      )}
      {entry.isFinished && !entry.isSaved && (
        <Row gap="md" justify="start" align="end" className="session__cardio-controls">
          <div className="session__input-group">
            <div className="session__input-label">
              <Span text="Kcal burned" size="small" />
            </div>
            <Input size="medium" value={entry.kcal} onChange={onKcalChange} />
          </div>
          <Button label="Save" onClick={onSave} />
        </Row>
      )}
    </div>
    {entry.isSaved && <Span text={`${entry.kcal} kcal burned`} size="small" />}
  </section>
);
