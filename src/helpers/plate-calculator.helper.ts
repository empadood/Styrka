import type { WeightUnit } from "./weight-unit.helper";

const BAR_WEIGHT_KG = 20;
const PLATE_WEIGHTS_KG = [25, 20, 15, 10, 5, 2.5, 1.25] as const;
const EPSILON = 0.001;

// Below this total weight, prefer 20kg plates over 25kg ones.
const HEAVY_PLATE_THRESHOLD_KG = 150;

const BAR_WEIGHT_LB = 45;
const PLATE_WEIGHTS_LB = [45, 35, 25, 10, 5, 2.5] as const;

// Below this total weight, prefer 35lb plates over 45lb ones.
const HEAVY_PLATE_THRESHOLD_LB = 330;

type PlateColor = "red" | "blue" | "yellow" | "green";
type PlateSize = "lg" | "sm";

const PLATE_STYLES_KG: Record<(typeof PLATE_WEIGHTS_KG)[number], { color: PlateColor; size: PlateSize }> = {
  25: { color: "red", size: "lg" },
  20: { color: "blue", size: "lg" },
  15: { color: "yellow", size: "lg" },
  10: { color: "green", size: "lg" },
  5: { color: "red", size: "sm" },
  2.5: { color: "blue", size: "sm" },
  1.25: { color: "yellow", size: "sm" },
};

const PLATE_STYLES_LB: Record<(typeof PLATE_WEIGHTS_LB)[number], { color: PlateColor; size: PlateSize }> = {
  45: { color: "red", size: "lg" },
  35: { color: "blue", size: "lg" },
  25: { color: "yellow", size: "lg" },
  10: { color: "green", size: "sm" },
  5: { color: "red", size: "sm" },
  2.5: { color: "blue", size: "sm" },
};

const PLATE_STYLES: Record<WeightUnit, Record<number, { color: PlateColor; size: PlateSize }>> = {
  kg: PLATE_STYLES_KG,
  lbs: PLATE_STYLES_LB,
};

type PlateCount = { weight: number; count: number };

type PlateBreakdown = {
  barWeight: number;
  perSide: PlateCount[];
  totalPlatedWeight: number;
  remainder: number;
};

const calculatePlateBreakdown = (targetWeight: number, unit: WeightUnit = "kg"): PlateBreakdown => {
  const barWeight = unit === "lbs" ? BAR_WEIGHT_LB : BAR_WEIGHT_KG;
  const plateWeights = unit === "lbs" ? PLATE_WEIGHTS_LB : PLATE_WEIGHTS_KG;
  const heavyPlateThreshold = unit === "lbs" ? HEAVY_PLATE_THRESHOLD_LB : HEAVY_PLATE_THRESHOLD_KG;
  const excludedTopPlate = unit === "lbs" ? 45 : 25;

  if (targetWeight <= barWeight) {
    return {
      barWeight,
      perSide: [],
      totalPlatedWeight: barWeight,
      remainder: 0,
    };
  }

  let remaining = (targetWeight - barWeight) / 2;
  const perSide: PlateCount[] = [];
  const availablePlates =
    targetWeight < heavyPlateThreshold
      ? plateWeights.filter((plateWeight) => plateWeight !== excludedTopPlate)
      : plateWeights;

  for (const plateWeight of availablePlates) {
    let count = 0;
    while (remaining + EPSILON >= plateWeight) {
      remaining -= plateWeight;
      count += 1;
    }
    if (count > 0) {
      perSide.push({ weight: plateWeight, count });
    }
  }

  const remainder = remaining > EPSILON ? remaining : 0;
  const platedPerSide = (targetWeight - barWeight) / 2 - remainder;

  return {
    barWeight,
    perSide,
    totalPlatedWeight: barWeight + platedPerSide * 2,
    remainder: remainder * 2,
  };
};

export {
  BAR_WEIGHT_KG,
  BAR_WEIGHT_LB,
  calculatePlateBreakdown,
  PLATE_STYLES,
  PLATE_WEIGHTS_KG,
  PLATE_WEIGHTS_LB,
  type PlateBreakdown,
};
