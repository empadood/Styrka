import "./PlateIndicator.scss";

import { calculatePlateBreakdown, PLATE_STYLES } from "../../helpers/plate-calculator.helper";
import { useWeightUnit } from "../../hooks/useWeightUnit";

type Props = {
  weight: number;
  onClick: () => void;
  ariaLabel: string;
};

export const PlateIndicator = ({ weight, onClick, ariaLabel }: Props) => {
  const { unit, toDisplay } = useWeightUnit();
  const breakdown = calculatePlateBreakdown(toDisplay(weight), unit);
  const plates = breakdown.perSide.flatMap((plate) =>
    Array.from({ length: plate.count }, () => plate.weight),
  );
  const styles = PLATE_STYLES[unit];

  return (
    <button
      type="button"
      className="plate-indicator"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="plate-indicator__bar" aria-hidden="true" />
      {plates.length === 0 ? (
        <span className="plate-indicator__empty" aria-hidden="true" />
      ) : (
        plates.map((plateWeight, index) => {
          const style = styles[plateWeight];
          return (
            <span
              key={index}
              className={`plate-indicator__plate plate-indicator__plate--${style.size} plate-indicator__plate--${style.color}`}
              aria-hidden="true"
            />
          );
        })
      )}
    </button>
  );
};
