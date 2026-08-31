import { useState } from "react";

import { Button } from "../button/Button";
import { Dialog } from "../dialog/Dialog";
import { SectionCard } from "../sectioncard/SectionCard";
import { Span } from "../text/Span";

type Props = {
  onClearHistory: () => void;
};

export const DangerZoneSection = ({ onClearHistory }: Props) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <SectionCard
      title="Danger zone"
      description="Permanently erase your workout history, working weights, increments, and estimated 1RM, then start over from the beginning."
      gap="sm"
    >
      <Button
        onClick={() => setShowConfirm(true)}
        label="Clear history"
        variant="danger"
        ariaLabel="Clear all workout history and progress"
      />
      <Dialog
        title="Clear history?"
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        actionLabel="Cancel"
        destructiveAction={{
          label: "Clear history",
          onClick: () => {
            onClearHistory();
            setShowConfirm(false);
          },
          ariaLabel: "Confirm clearing all workout history and progress",
        }}
      >
        <Span text="This can't be undone. All progress will be reset and you'll start from the beginning." />
      </Dialog>
    </SectionCard>
  );
};
