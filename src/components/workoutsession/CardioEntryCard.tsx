import { Pause, Play, Trash2 } from "lucide-react";

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
  onKcalChange: (value: number) => void;
  onRemove: () => void;
};

export const CardioEntryCard = ({ entry, onStart, onPause, onKcalChange, onRemove }: Props) => (
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
    <Row gap="md" align="center" className="session__cardio-controls">
      <Button
        icon={entry.isRunning ? Pause : Play}
        variant={entry.isRunning ? "secondary" : "primary"}
        size="icon"
        ariaLabel={entry.isRunning ? `Pause ${entry.label}` : `Start ${entry.label}`}
        onClick={entry.isRunning ? onPause : onStart}
      />
      <CardioTimerDisplay entry={entry} />
      <div className="session__input-group">
        <div className="session__input-label">
          <Span text="Kcal burned" size="small" />
        </div>
        <Input size="medium" value={entry.kcal} onChange={onKcalChange} />
      </div>
    </Row>
  </section>
);
