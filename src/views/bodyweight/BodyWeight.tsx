import "./BodyWeight.scss";

import { useState } from "react";

import {
  Button,
  Card,
  Heading,
  Input,
  Row,
  Span,
  Stack,
} from "../../components";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import {
  buildBodyWeightTrendData,
  getBodyWeightChartDomain,
} from "../../helpers/bodyweight.helper";
import type { BodyWeightEntry } from "../../types";

type Props = {
  log: BodyWeightEntry[];
  onLog: (weight: number, bodyFatPercent?: number) => void;
};

export const BodyWeight = ({ log, onLog }: Props) => {
  const [draft, setDraft] = useState(0);
  const [fatDraft, setFatDraft] = useState(0);
  const trendData = buildBodyWeightTrendData(log);
  const chartDomain = getBodyWeightChartDomain(log);
  const hasBodyFatData = log.some(
    (entry) => entry.bodyFatPercent !== undefined,
  );

  return (
    <Stack gap="lg" className="bodyweight__container">
      <Card>
        <Heading text="Log today's weight" level="3" />
        <Row gap="sm" align="end" className="bodyweight__form">
          <label className="bodyweight__field">
            <Span text="Weight (kg)" size="small" tone="secondary" />
            <Input value={draft} size="medium" onChange={setDraft} />
          </label>
          <label className="bodyweight__field">
            <Span text="Body fat % (optional)" size="small" tone="secondary" />
            <Input value={fatDraft} size="medium" onChange={setFatDraft} />
          </label>
          <Button
            label="Log weight"
            onClick={() => onLog(draft, fatDraft > 0 ? fatDraft : undefined)}
          />
        </Row>
      </Card>

      <Card>
        <Heading text="Bodyweight over time" level="3" />
        <SingleLineChart
          data={trendData}
          dataKey="weight"
          label="Bodyweight"
          unit="kg"
          color="var(--primary)"
          domain={chartDomain}
          secondary={
            hasBodyFatData
              ? {
                  dataKey: "bodyFatPercent",
                  label: "Body fat",
                  unit: "%",
                  color: "var(--warning)",
                }
              : undefined
          }
        />
      </Card>
    </Stack>
  );
};
