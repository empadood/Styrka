import { useWeightUnit } from "../../hooks/useWeightUnit";
import { Span } from "./Span";

type Props = {
  weight: number | string;
  size?: "small" | "normal" | "large";
};

export const Weight = ({ weight, size }: Props) => {
  const { toDisplay, label } = useWeightUnit();
  const displayValue = typeof weight === "number" ? toDisplay(weight) : weight;
  const formatted = `${displayValue} ${label}`;
  return <Span text={formatted} size={size} />;
};
