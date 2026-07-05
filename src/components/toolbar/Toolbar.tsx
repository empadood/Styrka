import "./Toolbar.css";

import { Button } from "../button/Button";
import { Span } from "../text/Span";
type Props = {
  title: string;
  onShowProfile: () => void;
};
export const Toolbar = ({ title, onShowProfile }: Props) => {
  return (
    <div className="toolbar">
      <Span text={title} />
      <Button onClick={onShowProfile} showIcon />
    </div>
  );
};
