import type { ReactNode } from "react";
import "./Section.css";
type Props = {
  children: ReactNode;
};
export const Section = ({ children }: Props) => {
  return <section className="section">{children}</section>;
};
