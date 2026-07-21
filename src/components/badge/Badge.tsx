import "./Badge.scss";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "danger";
  size?: "sm" | "md";
  className?: string;
};

export const Badge = ({
  children,
  tone = "neutral",
  size = "md",
  className = "",
}: Props) => {
  return (
    <span className={`badge badge--${tone} badge--${size} ${className}`}>
      {children}
    </span>
  );
};
