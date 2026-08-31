import { Pause, Play, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getElapsedSeconds } from "../../helpers/cardio.helper";
import type { LoggedCardioSession } from "../../types";
import { Button } from "../button/Button";
import { ExpandToggleButton } from "../cardactions/ExpandToggleButton";
import { RemoveButton } from "../cardactions/RemoveButton";
import { CardioTimerDisplay } from "../cardiotimer/CardioTimerDisplay";
import { Field } from "../field/Field";
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
}: Props) => {
  const [open, setOpen] = useState(!entry.isSaved);
  const wasSaved = useRef(entry.isSaved);

  useEffect(() => {
    if (entry.isSaved && !wasSaved.current) {
      setOpen(false);
    }
    wasSaved.current = entry.isSaved;
  }, [entry.isSaved]);

  const minutes = Math.round(getElapsedSeconds(entry, Date.now()) / 60);

  return (
    <section className="session__exercise session__cardio">
      <Row justify="between" className="session__exercise-header">
        <Row gap="sm" align="center">
          <Heading text={entry.label} level="3" />
          {!open && (
            <Span text={`${minutes} min | ${entry.kcal} kcal`} size="small" tone="secondary" />
          )}
        </Row>
        <Row gap="sm" align="center">
          <RemoveButton label={entry.label} onClick={onRemove} />
          <ExpandToggleButton open={open} label={entry.label} onClick={() => setOpen((value) => !value)} />
        </Row>
      </Row>
      {open && (
        <>
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
                <Field as="div" label="Kcal burned">
                  <Input size="medium" value={entry.kcal} onChange={onKcalChange} />
                </Field>
                <Button label="Save" onClick={onSave} />
              </Row>
            )}
          </div>
          {entry.isSaved && <Span text={`${entry.kcal} kcal burned`} size="small" />}
        </>
      )}
    </section>
  );
};
