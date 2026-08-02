import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { isExerciseCompleted } from "../../helpers/progression.helper";
import { generateWarmupSets } from "../../helpers/warmup.helper";
import type { LoggedExercise } from "../../types";
import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { Row } from "../row/Row";
import { ExerciseWithWeight } from "../text/ExerciseWithWeight";
import { Span } from "../text/Span";
import { SetInputRow } from "./SetInputRow";

type WarmupEntry = { reps: number; weight: number };

type Props = {
  exercise: LoggedExercise;
  getWarmupEntry: (warmupIndex: number, defaultWeight: number) => WarmupEntry;
  onWarmupChange: (warmupIndex: number, field: "reps" | "weight", value: number, defaultWeight: number) => void;
  onSetChange: (setIndex: number, field: "reps" | "weight", value: number) => void;
  onShowPlates: (weight: number) => void;
  onRemove: () => void;
  onAddSet: () => void;
};

export const ExerciseCard = ({
  exercise,
  getWarmupEntry,
  onWarmupChange,
  onSetChange,
  onShowPlates,
  onRemove,
  onAddSet,
}: Props) => {
  const completed = isExerciseCompleted(exercise.sets);
  const [open, setOpen] = useState(!completed);
  const wasCompleted = useRef(completed);

  useEffect(() => {
    if (completed && !wasCompleted.current) {
      setOpen(false);
    }
    wasCompleted.current = completed;
  }, [completed]);

  const [hiddenWarmupIndices, setHiddenWarmupIndices] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    generateWarmupSets(exercise.weightUsed).forEach((warmupSet, warmupIndex) => {
      if (getWarmupEntry(warmupIndex, warmupSet.weight).reps > 0) {
        initial.add(warmupIndex);
      }
    });
    return initial;
  });

  const setsContainerRef = useRef<HTMLDivElement>(null);
  const pendingFocusIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingFocusIndexRef.current === null) {
      return;
    }
    const index = pendingFocusIndexRef.current;
    pendingFocusIndexRef.current = null;
    const container = setsContainerRef.current;
    if (!container) {
      return;
    }
    const inputs = container.querySelectorAll<HTMLElement>("input");
    const target = inputs[index] ?? Array.from(container.querySelectorAll<HTMLElement>("button")).pop();
    target?.focus();
  });

  const handleWarmupRepsBlur = (warmupIndex: number, position: number, reps: number) => {
    setHiddenWarmupIndices((prev) => {
      const next = new Set(prev);
      if (reps > 0) {
        next.add(warmupIndex);
      } else {
        next.delete(warmupIndex);
      }
      return next;
    });
    if (reps > 0) {
      pendingFocusIndexRef.current = position * 2;
    }
  };

  const visibleWarmups = exercise.showWarmupSets
    ? generateWarmupSets(exercise.weightUsed)
        .map((warmupSet, warmupIndex) => ({
          warmupSet,
          warmupIndex,
          entry: getWarmupEntry(warmupIndex, warmupSet.weight),
        }))
        .filter(({ warmupIndex }) => !hiddenWarmupIndices.has(warmupIndex))
    : [];

  return (
    <section className="session__exercise">
      <Row justify="between" className="session__exercise-header">
        <ExerciseWithWeight label={exercise.label} weight={exercise.weightUsed} />
        <Row gap="sm" align="center">
          {exercise.sourceLabel && <Badge size="sm">{exercise.sourceLabel}</Badge>}
          <Span
            text={`${exercise.sets.length} ${exercise.sets.length < 2 ? "set" : "sets"}`}
            size="small"
          />
          {exercise.isAdHoc && (
            <Button
              icon={Trash2}
              variant="danger"
              size="icon"
              ariaLabel={`Remove ${exercise.label}`}
              onClick={onRemove}
            />
          )}
          <Button
            icon={ChevronDown}
            variant="secondary"
            size="icon"
            ariaLabel={open ? `Collapse ${exercise.label}` : `Expand ${exercise.label}`}
            ariaExpanded={open}
            onClick={() => setOpen((value) => !value)}
          />
        </Row>
      </Row>
      {open && (
        <div className="session__sets" ref={setsContainerRef}>
          {visibleWarmups.map(({ warmupSet, warmupIndex, entry }, position) => (
            <SetInputRow
              key={`warmup-${warmupIndex}`}
              variant="warmup"
              label={`${Math.round(warmupSet.percentage * 100)}%`}
              targetRepsLabel={`Target reps: ${warmupSet.reps}`}
              reps={entry.reps}
              weight={entry.weight}
              onRepsChange={(value) => onWarmupChange(warmupIndex, "reps", value, warmupSet.weight)}
              onRepsBlur={() => handleWarmupRepsBlur(warmupIndex, position, entry.reps)}
              onWeightChange={(value) => onWarmupChange(warmupIndex, "weight", value, warmupSet.weight)}
              onShowPlates={onShowPlates}
              showWeightIndicator={exercise.showWeightIndicator}
              applyRounding={!exercise.isAdHoc}
            />
          ))}
          {exercise.sets.map((set, index) => (
            <SetInputRow
              key={index}
              label={`Set ${index + 1}`}
              targetRepsLabel={`Target reps: ${set.targetReps}`}
              reps={set.reps}
              weight={set.weight}
              onRepsChange={(value) => onSetChange(index, "reps", value)}
              onWeightChange={(value) => onSetChange(index, "weight", value)}
              onShowPlates={onShowPlates}
              showWeightIndicator={exercise.showWeightIndicator}
              applyRounding={!exercise.isAdHoc}
            />
          ))}
          <Button
            icon={Plus}
            variant="secondary"
            label="Add set"
            ariaLabel={`Add set to ${exercise.label}`}
            onClick={onAddSet}
          />
        </div>
      )}
    </section>
  );
};
