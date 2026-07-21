import "./PageContainer.scss";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const PageContainer = ({ children, className = "" }: Props) => {
  return <main className={`page-container ${className}`}>{children}</main>;
};
