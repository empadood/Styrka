import { Trash2 } from "lucide-react";

import { Button } from "../button/Button";

type Props = {
  label: string;
  onClick: () => void;
};

export const RemoveButton = ({ label, onClick }: Props) => (
  <Button
    icon={Trash2}
    variant="danger"
    size="icon"
    ariaLabel={`Remove ${label}`}
    onClick={onClick}
  />
);
