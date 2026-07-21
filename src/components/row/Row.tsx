import "./Row.scss";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  justify?: "start" | "between";
  align?: "center" | "start";
  gap?: "sm" | "md";
  mb?: "none" | "md";
  className?: string;
};

export const Row = ({
  children,
  justify = "between",
  align = "center",
  gap = "md",
  mb = "none",
  className = "",
}: Props) => {
  return (
    <div
      className={`row row--justify-${justify} row--align-${align} row--gap-${gap} row--mb-${mb} ${className}`}
    >
      {children}
    </div>
  );
};
