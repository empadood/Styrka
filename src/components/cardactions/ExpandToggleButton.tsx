import { ChevronDown } from "lucide-react";

import { Button } from "../button/Button";

type Props = {
  open: boolean;
  label: string;
  onClick: () => void;
};

export const ExpandToggleButton = ({ open, label, onClick }: Props) => (
  <Button
    icon={ChevronDown}
    variant="secondary"
    size="icon"
    ariaLabel={open ? `Collapse ${label}` : `Expand ${label}`}
    ariaExpanded={open}
    onClick={onClick}
  />
);
