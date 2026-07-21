import "./PostWorkout.scss";

import { useState } from "react";

import { Badge, Button, Card, Heading, Row, Stack } from "../../components";
import { Input } from "../../components/input/Input";
import { RpeScale } from "../../components/rpescale/RpeScale";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { Span } from "../../components/text/Span";
import { Weight } from "../../components/text/Weight";
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
      <Button
        label="Edit workout"
        variant="secondary"
        onClick={onBack}
      />
      {results.map((result) => (
        <div className="postworkout__exercise" key={result.exerciseId}>
          <ExerciseWithWeight
            label={result.label}
            weight={result.previousWeight}
          />
          {!result.tracked ? (
            <div className="postworkout__no-increase">
              <Span text="Logged — no auto progression for this exercise" size="small" />
            </div>
          ) : result.completed ? (
            <>
              <Stack gap="xs" className="postworkout__increment">
                <Span text="Increment" size="small" />
                <Input
                  value={increments[result.exerciseId as TrackedLiftId]}
                  size="small"
                  onChange={(val) =>
                    setIncrements((prev) => ({
                      ...prev,
                      [result.exerciseId]: val,
                    }))
                  }
                />
              </Stack>
              <Stack gap="xs" className="postworkout__next">
                <Span text="Next session" size="small" />
                <Weight
                  weight={
                    Math.round(
                      (result.previousWeight +
                        increments[result.exerciseId as TrackedLiftId]) *
                        10,
                    ) / 10
                  }
                />
              </Stack>
            </>
          ) : (
            <div className="postworkout__no-increase">
              <Span text="No increase — same weight next time" size="small" />
            </div>
          )}
        </div>
      ))}

      <Card>
        <Heading text="How did it feel?" level="3" />
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
      </Card>

      {DRIVE_SYNC_UI_ENABLED && (
        <Row justify="start" gap="sm">
          <Button
            label={drive.status === "syncing" ? "Syncing…" : "Sync now"}
            variant="secondary"
            disabled={drive.status === "syncing"}
            onClick={drive.sync}
          />
          {drive.status === "success" && <Badge tone="success">Synced</Badge>}
          {drive.status === "error" && (
            <Span text={drive.errorMessage ?? "Sync failed."} size="small" />
          )}
        </Row>
      )}

      <Button
        label="Confirm"
        onClick={() => onConfirm(increments, { rpe, notes })}
      />
    </Stack>
  );
};
