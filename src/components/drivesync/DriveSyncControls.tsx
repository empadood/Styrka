import type { DriveSyncState } from "../../hooks/useDriveSync";
import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { Row } from "../row/Row";
import { Span } from "../text/Span";

type Props = {
  drive: DriveSyncState;
  className?: string;
};

export const DriveSyncControls = ({ drive, className }: Props) => (
  <Row justify="start" gap="sm" className={className}>
    <Button
      label={drive.status === "syncing" ? "Syncing…" : "Sync now"}
      variant="secondary"
      disabled={drive.status === "syncing"}
      onClick={drive.sync}
    />
    {drive.status === "success" && <Badge tone="success">Synced</Badge>}
    {drive.status === "error" && <Span text={drive.errorMessage ?? "Sync failed."} size="small" />}
  </Row>
);
