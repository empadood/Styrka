import "./Span.css";
type Props = {
  text: string | number;
  capitalize?: boolean;
};
export const Span = ({ text, capitalize }: Props) => {
  return (
    <span
      className="span"
      style={{ textTransform: capitalize ? "capitalize" : "" }}
    >
      {text}
    </span>
  );
};
