import "./Profile.scss";

import { useState } from "react";

import { Badge, Button, Card, Heading, Input, Row, Span, Stack } from "../../components";
import { ExerciseWithWeight } from "../../components/text/ExerciseWithWeight";
import { DRIVE_SYNC_UI_ENABLED, type DriveSyncState } from "../../hooks/useDriveSync";
import { EXERCISE, EXERCISE_LABELS, type TrackedLiftId } from "../../types";

type Props = {
  increments: Record<TrackedLiftId, number>;
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
  drive: DriveSyncState;
};

export const Profile = ({
  increments,
  estimatedOneRepMax,
  workingWeights,
  onOverrideWeight,
  drive,
}: Props) => {
  const [drafts, setDrafts] =
    useState<Record<TrackedLiftId, number>>(workingWeights);

  return (
    <Stack gap="lg" className="profile__container">
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
                  onChange={(value) =>
                    setDrafts((prev) => ({ ...prev, [exercise]: value }))
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
      </Card>

      <Card>
        <Heading text="Current Estimated One Rep Max" />
        {estimatedOneRepMax && (
          <div className="profile__configure">
            {Object.values(EXERCISE).map((exercise) => (
              <ExerciseWithWeight
                label={EXERCISE_LABELS[exercise]}
                key={exercise}
                weight={estimatedOneRepMax[exercise]}
              />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <Heading text="Current Incremenation Per Session" />
        <div className="profile__configure">
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.benchpress]}
            weight={increments[EXERCISE.benchpress]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.deadlift]}
            weight={increments[EXERCISE.deadlift]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.ohp]}
            weight={increments[EXERCISE.ohp]}
          />
          <ExerciseWithWeight
            label={EXERCISE_LABELS[EXERCISE.squat]}
            weight={increments[EXERCISE.squat]}
          />
        </div>
      </Card>

      {DRIVE_SYNC_UI_ENABLED && (
        <Card>
          <Heading text="Cloud sync" />
          <Span
            text="Manually back up or restore your data via a private, app-only file in your Google Drive."
            size="small"
          />
          <Row justify="start" gap="sm" className="profile__sync">
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
          {drive.status === "conflict" && (
            <Stack gap="xs">
              <Span
                text="Cloud data is newer than what's on this device. Overwrite local data with the cloud version?"
                size="small"
              />
              <Row gap="sm">
                <Button
                  label="Use cloud version"
                  variant="secondary"
                  onClick={drive.confirmPullRemote}
                />
                <Button
                  label="Keep local version"
                  variant="secondary"
                  onClick={drive.dismissConflict}
                />
              </Row>
            </Stack>
          )}
        </Card>
      )}

      <Card>
        <Heading text="Privacy" />
        <Span
          text="We use cookie-free, aggregate analytics to understand app usage. Workout data and personal identifiers are never collected."
          size="small"
        />
      </Card>
    </Stack>
  );
};
