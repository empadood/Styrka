import "./Badge.scss";

import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "primary" | "success" | "danger";

type Props = {
  children: ReactNode;
  tone?: BadgeTone;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export const Badge = ({
  children,
  tone = "neutral",
  size = "md",
  className = "",
  onClick,
  ariaLabel,
}: Props) => {
  const badgeClassName = `badge badge--${tone} badge--${size} ${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        className={`${badgeClassName} badge--clickable`}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  return <span className={badgeClassName}>{children}</span>;
};
