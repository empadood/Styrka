import "./PostWorkout.scss";

import { useState } from "react";

import { Button, SectionCard, Span, Stack } from "../../components";
import { DriveSyncControls } from "../../components/drivesync/DriveSyncControls";
import { ExerciseIncrementRow } from "../../components/postworkout/ExerciseIncrementRow";
import { RpeScale } from "../../components/rpescale/RpeScale";
import type { ProgressionResult } from "../../helpers/progression.helper";
import { DRIVE_SYNC_UI_ENABLED, type DriveSyncState } from "../../hooks/useDriveSync";
import type { SessionCheckIn, TrackedLiftId } from "../../types";

type Props = {
  results: ProgressionResult[];
  onConfirm: (
    finalIncrements: Record<TrackedLiftId, number>,
    checkIn: SessionCheckIn,
  ) => void;
  onBack: () => void;
  drive: DriveSyncState;
};

export const PostWorkout = ({ results, onConfirm, onBack, drive }: Props) => {
  const [increments, setIncrements] = useState<Record<TrackedLiftId, number>>(
    () =>
      Object.fromEntries(
        results
          .filter((result) => result.tracked && result.completed)
          .map((result) => [result.exerciseId, result.proposedIncrement]),
      ) as Record<TrackedLiftId, number>,
  );
  const [rpe, setRpe] = useState(5);
  const [notes, setNotes] = useState("");

  return (
    <Stack gap="lg" className="postworkout__container">
      <Button label="Edit workout" variant="secondary" onClick={onBack} />
      {results.map((result) => (
        <ExerciseIncrementRow
          key={result.exerciseId}
          result={result}
          increment={increments[result.exerciseId as TrackedLiftId]}
          onIncrementChange={(value) =>
            setIncrements((prev) => ({ ...prev, [result.exerciseId]: value }))
          }
        />
      ))}

      <SectionCard title="How did it feel?" level="3">
        <div className="postworkout__rpe">
          <Span text="Rate of perceived exertion" size="small" />
          <RpeScale value={rpe} onChange={setRpe} />
        </div>
        <textarea
          className="postworkout__notes"
          placeholder="What did you actually do, and how did it feel?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </SectionCard>

      {DRIVE_SYNC_UI_ENABLED && <DriveSyncControls drive={drive} />}

      <Button label="Confirm" onClick={() => onConfirm(increments, { rpe, notes })} />
    </Stack>
  );
};
