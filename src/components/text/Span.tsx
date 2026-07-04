import "./Span.css";
type Props = {
  text: string | number;
};
export const Span = ({ text }: Props) => {
  return <span className="span">{text}</span>;
};
