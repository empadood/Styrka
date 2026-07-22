import "./Profile.scss";

import { Card, Heading, Span, Stack } from "../../components";
import { DangerZoneSection } from "../../components/profile/DangerZoneSection";
import { DriveSyncSection } from "../../components/profile/DriveSyncSection";
import { ExportImportSection } from "../../components/profile/ExportImportSection";
import { IncrementsSection } from "../../components/profile/IncrementsSection";
import { OneRepMaxSection } from "../../components/profile/OneRepMaxSection";
import { UnitsSection } from "../../components/profile/UnitsSection";
import { WorkingWeightSection } from "../../components/profile/WorkingWeightSection";
import type { WorkoutStore } from "../../data/storage";
import type { RoundingStep, WeightUnit } from "../../helpers/weight-unit.helper";
import { DRIVE_SYNC_UI_ENABLED, type DriveSyncState } from "../../hooks/useDriveSync";
import type { TrackedLiftId } from "../../types";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
  increments: Record<TrackedLiftId, number>;
  estimatedOneRepMax: Record<TrackedLiftId, number> | null;
  workingWeights: Record<TrackedLiftId, number>;
  onOverrideWeight: (exercise: TrackedLiftId, weight: number) => void;
  onClearHistory: () => void;
  drive: DriveSyncState;
};

export const Profile = ({
  store,
  update,
  increments,
  estimatedOneRepMax,
  workingWeights,
  onOverrideWeight,
  onClearHistory,
  drive,
}: Props) => (
  <Stack gap="lg" className="profile__container">
    <UnitsSection
      weightUnit={store.weightUnit}
      onChangeWeightUnit={(weightUnit: WeightUnit) => update((prev) => ({ ...prev, weightUnit }))}
      weightRounding={store.weightRounding}
      onChangeRounding={(unit: WeightUnit, step: RoundingStep) =>
        update((prev) => ({
          ...prev,
          weightRounding: { ...prev.weightRounding, [unit]: step },
        }))
      }
    />
    <WorkingWeightSection workingWeights={workingWeights} onOverrideWeight={onOverrideWeight} />
    <OneRepMaxSection estimatedOneRepMax={estimatedOneRepMax} />
    <IncrementsSection increments={increments} />
    {DRIVE_SYNC_UI_ENABLED && <DriveSyncSection drive={drive} />}
    <ExportImportSection store={store} update={update} />
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
