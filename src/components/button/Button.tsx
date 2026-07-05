import "./Button.css";

import { Hamburger } from "../../icons";
import { Span } from "../text/Span";
type Props = {
  onClick: () => void;
  label?: string;
  showIcon?: boolean;
};
export const Button = ({ onClick, label, showIcon = false }: Props) => {
  return (
    <>
      <button className="button" onClick={onClick}>
        {label && <Span text={label} />}
        {showIcon && <Hamburger />}
      </button>
    </>
  );
};
