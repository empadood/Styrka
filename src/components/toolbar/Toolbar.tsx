import { Button } from "../button/Button";
import { Span } from "../text/Span";
import "./Toolbar.css";
type Props = {
  title: string;
};
export const Toolbar = ({ title }: Props) => {
  const onClick = () => console.log("hej");

  return (
    <div className="toolbar">
      <Span text={title} />
      <Button onClick={onClick} showIcon />
    </div>
  );
};
