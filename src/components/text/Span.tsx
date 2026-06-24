import "./Span.css";
type Props = {
  text: string;
};
export const Span = ({ text }: Props) => {
  return <span className="span">{text}</span>;
};
