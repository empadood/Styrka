import "./RpeScale.css";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const SCALE = Array.from({ length: 10 }, (_, index) => index + 1);

export const RpeScale = ({ value, onChange }: Props) => {
  return (
    <div className="rpe-scale" role="radiogroup" aria-label="Rate of perceived exertion">
      {SCALE.map((rating) => (
        <button
          key={rating}
          type="button"
          className={`rpe-scale__option ${rating === value ? "rpe-scale__option--selected" : ""}`}
          role="radio"
          aria-checked={rating === value}
          onClick={() => onChange(rating)}
        >
          {rating}
        </button>
      ))}
    </div>
  );
};
