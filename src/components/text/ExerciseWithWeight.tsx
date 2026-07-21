import "./ExcerciseWithWeight.scss";

import { Span } from "./Span";
import { Weight } from "./Weight";
type Props = {
  label: string;
  weight: number | string;
};
export const ExerciseWithWeight = ({ label, weight }: Props) => {
  return (
    <div className="exercise--gap">
      <Span text={label} capitalize />
      <Weight weight={weight} />
    </div>
  );
};
