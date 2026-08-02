type WeightUnit = "kg" | "lbs";
type RoundingStep = 1 | 1.5 | 2.5 | 5;

const ROUNDING_STEPS: RoundingStep[] = [1, 1.5, 2.5, 5];

const KG_PER_LB = 0.45359237;

const roundTo = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const roundToStep = (value: number, step: RoundingStep): number => Math.round(value / step) * step;

const kgToLb = (kg: number): number => kg / KG_PER_LB;
const lbToKg = (lb: number): number => lb * KG_PER_LB;

const toDisplayWeight = (kg: number, unit: WeightUnit, step: RoundingStep | null): number => {
  const raw = unit === "lbs" ? kgToLb(kg) : kg;
  return step === null ? roundTo(raw, 2) : roundToStep(raw, step);
};

const toStorageWeight = (value: number, unit: WeightUnit, step: RoundingStep | null): number => {
  const snapped = step === null ? value : roundToStep(value, step);
  return unit === "lbs" ? roundTo(lbToKg(snapped), 2) : roundTo(snapped, 2);
};

const getWeightUnitLabel = (unit: WeightUnit): string => unit;

const formatWeight = (kg: number, unit: WeightUnit, step: RoundingStep): string =>
  `${toDisplayWeight(kg, unit, step)} ${getWeightUnitLabel(unit)}`;

export {
  formatWeight,
  getWeightUnitLabel,
  kgToLb,
  lbToKg,
  ROUNDING_STEPS,
  type RoundingStep,
  roundToStep,
  toDisplayWeight,
  toStorageWeight,
  type WeightUnit,
};
