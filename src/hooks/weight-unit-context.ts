import { createContext } from "react";

import type { WeightUnit } from "../helpers/weight-unit.helper";

type WeightUnitContextValue = {
  unit: WeightUnit;
  label: string;
  toDisplay: (kg: number) => number;
  toStorage: (value: number) => number;
  format: (kg: number) => string;
};

const WeightUnitContext = createContext<WeightUnitContextValue | null>(null);

export { WeightUnitContext, type WeightUnitContextValue };
