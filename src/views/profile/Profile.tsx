import "./Profile.scss";

import { Card, Heading, Span, Stack } from "../../components";
import { DangerZoneSection } from "../../components/profile/DangerZoneSection";
import { DriveSyncSection } from "../../components/profile/DriveSyncSection";
import { IncrementsSection } from "../../components/profile/IncrementsSection";
import { OneRepMaxSection } from "../../components/profile/OneRepMaxSection";
import { WorkingWeightSection } from "../../components/profile/WorkingWeightSection";
import { DRIVE_SYNC_UI_ENABLED, type DriveSyncState } from "../../hooks/useDriveSync";
import type { TrackedLiftId } from "../../types";

type Props = {
  increments: Record<TrackedLiftId, number>;
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
  onClearHistory: () => void;
  drive: DriveSyncState;
};

export const Profile = ({
  increments,
  estimatedOneRepMax,
  workingWeights,
  onOverrideWeight,
  onClearHistory,
  drive,
}: Props) => (
  <Stack gap="lg" className="profile__container">
    <WorkingWeightSection workingWeights={workingWeights} onOverrideWeight={onOverrideWeight} />
    <OneRepMaxSection estimatedOneRepMax={estimatedOneRepMax} />
    <IncrementsSection increments={increments} />
    {DRIVE_SYNC_UI_ENABLED && <DriveSyncSection drive={drive} />}
    <Card>
      <Heading text="Privacy" />
      <Span
        text="We use cookie-free, aggregate analytics to understand app usage. Workout data and personal identifiers are never collected."
        size="small"
      />
    </Card>
    <DangerZoneSection onClearHistory={onClearHistory} />
  </Stack>
);
