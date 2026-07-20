import type { TrackedLiftId } from "../types";

const TRAINING_WEIGHT_RATIO = 0.7;
const WEIGHT_INCREMENT = 2.5;

const getStartingWeight = (oneRepMax: number): number =>
  Math.max(
    WEIGHT_INCREMENT,
    Math.round((oneRepMax * TRAINING_WEIGHT_RATIO) / WEIGHT_INCREMENT) *
      WEIGHT_INCREMENT,
  );

const buildStartingWeights = (
  estimatedOneRepMax: Record<TrackedLiftId, number>,
): Record<TrackedLiftId, number> =>
  Object.fromEntries(
    Object.entries(estimatedOneRepMax).map(([exercise, oneRepMax]) => [
      exercise,
      getStartingWeight(oneRepMax),
    ]),
  ) as Record<TrackedLiftId, number>;

export { buildStartingWeights };
