import "./Span.css";
type Props = {
  text: string | number;
  size?: "small" | "normal" | "large";
  capitalize?: boolean;
};
export const Span = ({ text, capitalize, size = "normal" }: Props) => {
  const fontSize = {
    small: "14px",
    normal: "16px",
    large: "20px",
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
