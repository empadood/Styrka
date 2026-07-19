import "./Section.css";

import type { ReactNode } from "react";
type Props = {
  children: ReactNode;
  className?: string;
};
export const Section = ({ children, className = "" }: Props) => {
  return <section className={`section ${className}`}>{children}</section>;
};
