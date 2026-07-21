import "./Stack.scss";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  as?: "div" | "ul";
  className?: string;
};

export const Stack = ({ children, gap = "sm", as = "div", className = "" }: Props) => {
  const Tag = as;
  return <Tag className={`stack stack--gap-${gap} ${className}`}>{children}</Tag>;
};
