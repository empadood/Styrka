import { Span } from "./Span";

type Props = {
  weight: number | string;
  unit?: "kg";
  size?: "small" | "normal" | "large";
};

export const Weight = ({ weight, unit = "kg", size }: Props) => {
  const formatted = `${weight} ${unit}`;
  return <Span text={formatted} size={size} />;
};
