import { useWeightUnit } from "../../hooks/useWeightUnit";
import { Span } from "./Span";

type Props = {
  weight: number | string;
  size?: "small" | "normal" | "large";
  isBodyweight?: boolean;
};

export const Weight = ({ weight, size, isBodyweight }: Props) => {
  const { toDisplay, label } = useWeightUnit();

  if (isBodyweight && typeof weight === "number") {
    const displayValue = toDisplay(weight);
    const formatted = displayValue > 0 ? `BW +${displayValue} ${label}` : "BW";
    return <Span text={formatted} size={size} />;
  }

  const displayValue = typeof weight === "number" ? toDisplay(weight) : weight;
  const formatted = `${displayValue} ${label}`;
  return <Span text={formatted} size={size} />;
};
