import type { ReactNode } from "react";

import { Card } from "../card/Card";
import { Stack } from "../stack/Stack";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  title: string;
  level?: "1" | "2" | "3" | "4" | "5" | "6";
  description?: string;
  children?: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  tone?: "surface" | "primary";
  gap?: "xs" | "sm" | "md" | "lg";
};

export const SectionCard = ({
  title,
  level = "1",
  description,
  children,
  className,
  padding,
  tone,
  gap,
}: Props) => {
  const content = (
    <>
      <Heading text={title} level={level} />
      {description && <Span text={description} size="small" />}
      {children}
    </>
  );

  return (
    <Card className={className} padding={padding} tone={tone}>
      {gap ? <Stack gap={gap}>{content}</Stack> : content}
    </Card>
  );
};
