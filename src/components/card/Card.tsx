import "./Card.scss";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  tone?: "surface" | "primary";
  as?: "div" | "li" | "button";
  onClick?: () => void;
};

export const Card = ({
  children,
  className = "",
  padding = "lg",
  tone = "surface",
  as = "div",
  onClick,
}: Props) => {
  const Tag = as;
  return (
    <Tag
      className={`card card--padding-${padding} card--${tone} ${className}`}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
};
