import "./Section.css";

import type { ReactNode } from "react";
type Props = {
  children: ReactNode;
};
export const Section = ({ children }: Props) => {
  return <section className="section">{children}</section>;
};
