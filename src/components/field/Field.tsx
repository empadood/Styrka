import "./Field.scss";

import type { ReactNode } from "react";

import { Span } from "../text/Span";

type Props = {
  label: string;
  children?: ReactNode;
  size?: "small" | "normal" | "large";
  tone?: "default" | "secondary";
  orientation?: "column" | "row";
  controlFirst?: boolean;
  as?: "label" | "div";
  htmlFor?: string;
  wrap?: boolean;
  className?: string;
};

export const Field = ({
  label,
  children,
  size = "small",
  tone = "default",
  orientation = "column",
  controlFirst = false,
  as = "label",
  htmlFor,
  wrap = true,
  className = "",
}: Props) => {
  const caption = <Span text={label} size={size} tone={tone} />;

  if (!wrap) {
    return (
      <label htmlFor={htmlFor} className={`field field--caption-only ${className}`}>
        {caption}
      </label>
    );
  }

  const Tag = as;
  const modifier = controlFirst ? "field--reverse" : `field--${orientation}`;

  return (
    <Tag className={`field ${modifier} ${className}`}>
      {controlFirst ? (
        <>
          {children}
          {caption}
        </>
      ) : (
        <>
          {caption}
          {children}
        </>
      )}
    </Tag>
  );
};
