const BAR_WEIGHT_KG = 20;
const PLATE_WEIGHTS_KG = [25, 20, 15, 10, 5, 2.5, 1.25] as const;
const EPSILON = 0.001;

type PlateColor = "red" | "blue" | "yellow" | "green";
type PlateSize = "lg" | "sm";

const PLATE_STYLES: Record<(typeof PLATE_WEIGHTS_KG)[number], { color: PlateColor; size: PlateSize }> = {
  25: { color: "red", size: "lg" },
  20: { color: "blue", size: "lg" },
  15: { color: "yellow", size: "lg" },
  10: { color: "green", size: "lg" },
  5: { color: "red", size: "sm" },
  2.5: { color: "blue", size: "sm" },
  1.25: { color: "yellow", size: "sm" },
};

type PlateCount = { weight: number; count: number };

type PlateBreakdown = {
  barWeight: number;
  perSide: PlateCount[];
  totalPlatedWeight: number;
  remainderKg: number;
};

const calculatePlateBreakdown = (targetWeightKg: number): PlateBreakdown => {
  if (targetWeightKg <= BAR_WEIGHT_KG) {
    return {
      barWeight: BAR_WEIGHT_KG,
      perSide: [],
      totalPlatedWeight: BAR_WEIGHT_KG,
      remainderKg: 0,
    };
  }

  let remaining = (targetWeightKg - BAR_WEIGHT_KG) / 2;
  const perSide: PlateCount[] = [];

  for (const plateWeight of PLATE_WEIGHTS_KG) {
    let count = 0;
    while (remaining + EPSILON >= plateWeight) {
      remaining -= plateWeight;
      count += 1;
    }
    if (count > 0) {
      perSide.push({ weight: plateWeight, count });
    }
  }

  const remainderKg = remaining > EPSILON ? remaining : 0;
  const platedPerSide =
    (targetWeightKg - BAR_WEIGHT_KG) / 2 - remainderKg;

  return {
    barWeight: BAR_WEIGHT_KG,
    perSide,
    totalPlatedWeight: BAR_WEIGHT_KG + platedPerSide * 2,
    remainderKg: remainderKg * 2,
  };
};

export {
  BAR_WEIGHT_KG,
  calculatePlateBreakdown,
  PLATE_STYLES,
  PLATE_WEIGHTS_KG,
  type PlateBreakdown,
};
