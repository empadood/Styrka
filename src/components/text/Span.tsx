import "./Span.scss";
type Props = {
  text: string | number;
  size?: "small" | "normal" | "large";
  tone?: "default" | "secondary";
  capitalize?: boolean;
};
export const Span = ({ text, capitalize, size = "normal", tone = "default" }: Props) => {
  const fontSize = {
    small: "0.875rem",
    normal: "1rem",
    large: "1.25rem",
  } as const;

  return (
    <span
      className={`span span--${tone}`}
      style={{
        textTransform: capitalize ? "capitalize" : "",
        fontSize: fontSize[size],
      }}
    >
      {text}
    </span>
  );
};
