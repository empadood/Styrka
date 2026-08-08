import "./ExcerciseWithWeight.scss";

import { Span } from "./Span";
import { Weight } from "./Weight";
type Props = {
  label: string;
  weight: number | string;
  isBodyweight?: boolean;
};
export const ExerciseWithWeight = ({ label, weight, isBodyweight }: Props) => {
  return (
    <div className="exercise--gap">
      <Span text={label} capitalize />
      <Weight weight={weight} isBodyweight={isBodyweight} />
    </div>
  );
};
