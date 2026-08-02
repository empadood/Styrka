import { createContext } from "react";

import type { RoundingStep, WeightUnit } from "../helpers/weight-unit.helper";

type WeightUnitContextValue = {
  unit: WeightUnit;
  label: string;
  toDisplay: (kg: number, step?: RoundingStep | null) => number;
  toStorage: (value: number, step?: RoundingStep | null) => number;
  format: (kg: number) => string;
};

const WeightUnitContext = createContext<WeightUnitContextValue | null>(null);

export { WeightUnitContext, type WeightUnitContextValue };
