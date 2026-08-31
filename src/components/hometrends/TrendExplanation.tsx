import type { TrainingStatus, TrainingStatusDetails } from "../../helpers/status.helper";
import { formatPercent } from "../../helpers/training-status-display.helper";
import { useWeightUnit } from "../../hooks/useWeightUnit";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";

type Props = {
  details: TrainingStatusDetails;
};

export const TrendExplanation = ({ details }: Props) => {
  const { format } = useWeightUnit();
  const formatWeight = (kg: number): string => format(kg);

  const {
    status,
    windowDays,
    sessionCount,
    earlyWeightAvg,
    lateWeightAvg,
    weightChangePercent,
    rpeTrend,
    earlyRpeAvg,
    lateRpeAvg,
    dipDetected,
  } = details;

  if (status === "insufficient-data") {
    return (
      <Span
        text={`Not enough completed workouts in the last ${windowDays} days — at least 2 are needed to calculate a trend.`}
        tone="secondary"
      />
    );
  }

  const summary: Record<TrainingStatus, string> = {
    gaining: "Your average working weight increased across your recent workouts.",
    declining:
      details.weightTrend === "down"
        ? "Your average working weight dropped across your recent workouts."
        : "Your working weight held steady, but your effort (RPE) has been climbing — a sign of declining recovery.",
    maintaining: "Your average working weight has stayed roughly the same.",
    comeback:
      "Your working weight dipped and has since recovered back above where it started.",
  };

  return (
    <Stack gap="md">
      <Span text={summary[status]} />
      <Stack gap="xs">
        <Span
          text={`Based on ${sessionCount} workouts in the last ${windowDays} days, compared across the earlier and later half of that window.`}
          size="small"
          tone="secondary"
        />
        {earlyWeightAvg !== null && lateWeightAvg !== null && weightChangePercent !== null && (
          <Span
            text={`Average working weight: ${formatWeight(earlyWeightAvg)} → ${formatWeight(lateWeightAvg)} (${formatPercent(weightChangePercent)}). Changes beyond ±1.5% count as a trend.`}
            size="small"
            tone="secondary"
          />
        )}
        {rpeTrend && rpeTrend !== "unknown" && earlyRpeAvg !== null && lateRpeAvg !== null && (
          <Span
            text={`Average RPE: ${earlyRpeAvg.toFixed(1)} → ${lateRpeAvg.toFixed(1)}. Changes beyond ±0.5 count as a trend.`}
            size="small"
            tone="secondary"
          />
        )}
        {status === "comeback" && dipDetected && (
          <Span
            text="A dip below your starting weight was detected before the recovery, which is why this is labeled a comeback rather than a plain gain."
            size="small"
            tone="secondary"
          />
        )}
      </Stack>
    </Stack>
  );
};
