import "./Button.scss";

import type { LucideIcon } from "lucide-react";

type Props = {
  onClick: () => void;
  label?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  size?: "default" | "icon";
  ariaLabel?: string;
  ariaExpanded?: boolean;
  disabled?: boolean;
};
export const Button = ({
  onClick,
  label,
  icon: Icon,
  variant = "primary",
  size = "default",
  ariaLabel,
  ariaExpanded,
  disabled = false,
}: Props) => {
  return (
    <button
      className={`button button--${variant} button--${size}`}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      disabled={disabled}
    >
      {Icon && <Icon aria-hidden="true" size={20} strokeWidth={2} />}
      {label && <span>{label}</span>}
    </button>
  );
};
