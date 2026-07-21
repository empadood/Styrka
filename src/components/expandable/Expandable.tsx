import "./Expandable.scss";

import { ChevronDown, type LucideIcon } from "lucide-react";
import { type ReactNode, useState } from "react";

type Props = {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export const Expandable = ({
  icon: Icon,
  label,
  children,
  defaultOpen = false,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="expandable">
      <button
        type="button"
        className="expandable__header"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="expandable__label">
          <Icon aria-hidden="true" size={18} strokeWidth={2} />
          <span>{label}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          strokeWidth={2}
          className={`expandable__chevron ${open ? "expandable__chevron--open" : ""}`}
        />
      </button>
      {open && <div className="expandable__content">{children}</div>}
    </div>
  );
};
