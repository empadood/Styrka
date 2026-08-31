import type { ReactNode } from "react";

import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  eyebrow: string;
  title: string;
  level?: "1" | "2" | "3" | "4" | "5" | "6";
  trailing?: ReactNode;
  className?: string;
};

export const CardHeader = ({ eyebrow, title, level = "2", trailing, className = "" }: Props) => (
  <Row justify="between" align="start" mb="md" className={className}>
    <div>
      <Span text={eyebrow} size="small" tone="secondary" />
      <Heading text={title} level={level} />
    </div>
    {trailing}
  </Row>
);
