import { BAR_WEIGHT_KG } from "./plate-calculator.helper";

const WEIGHT_INCREMENT = 2.5;

const WARMUP_STEPS: { percentage: number; reps: number }[] = [
  { percentage: 0.4, reps: 8 },
  { percentage: 0.6, reps: 5 },
  { percentage: 0.8, reps: 3 },
];

type WarmupSet = { percentage: number; weight: number; reps: number };

const roundToIncrement = (weight: number): number =>
  Math.round(weight / WEIGHT_INCREMENT) * WEIGHT_INCREMENT;

const generateWarmupSets = (workingWeightKg: number): WarmupSet[] =>
  WARMUP_STEPS.map(({ percentage, reps }) => ({
    percentage,
    reps,
    weight: roundToIncrement(workingWeightKg * percentage),
  })).filter((set) => set.weight > BAR_WEIGHT_KG);

export { generateWarmupSets, type WarmupSet };
