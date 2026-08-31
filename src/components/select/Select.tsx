import "./Select.scss";

import type { ReactNode } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  size?: "small" | "medium";
  id?: string;
  ariaLabel?: string;
  className?: string;
};

export const Select = ({
  value,
  onChange,
  children,
  size = "medium",
  id,
  ariaLabel,
  className = "",
}: Props) => (
  <select
    id={id}
    className={`select select--${size} ${className}`}
    value={value}
    aria-label={ariaLabel}
    onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>
);
