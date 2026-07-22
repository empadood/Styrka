import { useContext } from "react";

import { WeightUnitContext, type WeightUnitContextValue } from "./weight-unit-context";

const useWeightUnit = (): WeightUnitContextValue => {
  const context = useContext(WeightUnitContext);
  if (!context) {
    throw new Error("useWeightUnit must be used within a WeightUnitProvider");
  }
  return context;
};

export { useWeightUnit };
