import { Span } from "./Span";

type Props = {
  weight: number | string;
  unit?: "kg";
};

export const Weight = ({ weight, unit = "kg" }: Props) => {
  const formatted = `${weight} ${unit}`;
  return <Span text={formatted} />;
};
