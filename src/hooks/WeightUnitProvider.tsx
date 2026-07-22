import { type ReactNode,useMemo } from "react";

import {
  formatWeight,
  getWeightUnitLabel,
  type RoundingStep,
  toDisplayWeight,
  toStorageWeight,
  type WeightUnit,
} from "../helpers/weight-unit.helper";
import { WeightUnitContext, type WeightUnitContextValue } from "./weight-unit-context";

type ProviderProps = {
  unit: WeightUnit;
  roundingStep: RoundingStep;
  children: ReactNode;
};

export const WeightUnitProvider = ({ unit, roundingStep, children }: ProviderProps) => {
  const value = useMemo<WeightUnitContextValue>(
    () => ({
      unit,
      label: getWeightUnitLabel(unit),
      toDisplay: (kg: number) => toDisplayWeight(kg, unit, roundingStep),
      toStorage: (value: number) => toStorageWeight(value, unit, roundingStep),
      format: (kg: number) => formatWeight(kg, unit, roundingStep),
    }),
    [unit, roundingStep],
  );

  return <WeightUnitContext.Provider value={value}>{children}</WeightUnitContext.Provider>;
};
