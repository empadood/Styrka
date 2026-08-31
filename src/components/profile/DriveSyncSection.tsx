import type { DriveSyncState } from "../../hooks/useDriveSync";
import { Button } from "../button/Button";
import { DriveSyncControls } from "../drivesync/DriveSyncControls";
import { Row } from "../row/Row";
import { SectionCard } from "../sectioncard/SectionCard";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";

type Props = {
  drive: DriveSyncState;
};

export const DriveSyncSection = ({ drive }: Props) => (
  <SectionCard
    title="Cloud sync"
    description="Manually back up or restore your data via a private, app-only file in your Google Drive."
  >
    <DriveSyncControls drive={drive} className="profile__sync" />
    {drive.status === "conflict" && (
      <Stack gap="xs">
        <Span
          text="Cloud data is newer than what's on this device. Overwrite local data with the cloud version?"
          size="small"
        />
        <Row gap="sm">
          <Button label="Use cloud version" variant="secondary" onClick={drive.confirmPullRemote} />
          <Button label="Keep local version" variant="secondary" onClick={drive.dismissConflict} />
        </Row>
      </Stack>
    )}
  </SectionCard>
);
