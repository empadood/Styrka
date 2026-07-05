import { EXERCISE_LABELS, type ExerciseName } from "../../types";
import { Span } from "./Span";
import { Weight } from "./Weight";
import "./ExcerciseWithWeight.css";
type Props = {
  exercise: ExerciseName;
  weight: number | string;
};
export const ExerciseWithWeight = ({ exercise, weight }: Props) => {
  return (
    <div className="exercise--gap">
      <Span text={EXERCISE_LABELS[exercise]} capitalize />
      <Weight weight={weight} />
    </div>
  );
};
