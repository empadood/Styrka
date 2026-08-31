import type { BadgeTone } from "../components/badge/Badge";
import type { TrainingStatus } from "./status.helper";

export const STATUS_LABELS: Record<TrainingStatus | "insufficient-data", string> = {
  comeback: "Comeback",
  gaining: "Gaining",
  maintaining: "Maintaining",
  declining: "Declining",
  "insufficient-data": "Not enough data yet",
};

export const STATUS_TONES: Record<TrainingStatus | "insufficient-data", BadgeTone> = {
  comeback: "primary",
  gaining: "success",
  maintaining: "neutral",
  declining: "danger",
  "insufficient-data": "neutral",
};

export const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
