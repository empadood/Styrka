import "./Span.css";
type Props = {
  text: string | number;
  size?: "small" | "normal" | "large";
  capitalize?: boolean;
};
export const Span = ({ text, capitalize, size = "normal" }: Props) => {
  const fontSize = {
    small: "0.875rem",
    normal: "1rem",
    large: "1.25rem",
  } as const;

  return (
    <span
      className="span"
      style={{
        textTransform: capitalize ? "capitalize" : "",
        fontSize: fontSize[size],
      }}
    >
      {text}
    </span>
  );
};
