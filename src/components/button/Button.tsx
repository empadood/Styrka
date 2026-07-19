import "./Button.css";

import type { LucideIcon } from "lucide-react";

type Props = {
  onClick: () => void;
  label?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  size?: "default" | "icon";
  ariaLabel?: string;
  ariaExpanded?: boolean;
};
export const Button = ({
  onClick,
  label,
  icon: Icon,
  variant = "primary",
  size = "default",
  ariaLabel,
  ariaExpanded,
}: Props) => {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
    >
      {Icon && <Icon aria-hidden="true" size={20} strokeWidth={2} />}
      {label && <span>{label}</span>}
    </button>
  );
};
