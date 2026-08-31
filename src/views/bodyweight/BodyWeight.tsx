import "./BodyWeight.scss";

import { useState } from "react";

import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  Row,
  Stack,
} from "../../components";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import {
  buildBodyWeightTrendData,
  getBodyWeightChartDomain,
} from "../../helpers/bodyweight.helper";
import { useWeightUnit } from "../../hooks/useWeightUnit";
import type { BodyWeightEntry } from "../../types";

type Props = {
  log: BodyWeightEntry[];
  onLog: (weight: number, bodyFatPercent?: number) => void;
};

export const BodyWeight = ({ log, onLog }: Props) => {
  const [draft, setDraft] = useState(0);
  const [fatDraft, setFatDraft] = useState(0);
  const { unit, toDisplay, toStorage } = useWeightUnit();
  const trendData = buildBodyWeightTrendData(log).map((entry) => ({
    ...entry,
    weight: toDisplay(entry.weight),
  }));
  const chartDomain = getBodyWeightChartDomain(log)?.map((value) =>
    toDisplay(value),
  ) as [number, number] | undefined;
  const hasBodyFatData = log.some(
    (entry) => entry.bodyFatPercent !== undefined,
  );

  return (
    <Stack gap="lg" className="bodyweight__container">
      <Card>
        <Heading text="Log today's weight" level="3" />
        <Row gap="sm" align="end" className="bodyweight__form">
          <Field label={`Weight (${unit})`} tone="secondary">
            <Input value={draft} size="medium" onChange={setDraft} />
          </Field>
          <Field label="Body fat % (optional)" tone="secondary">
            <Input value={fatDraft} size="medium" onChange={setFatDraft} />
          </Field>
          <Button
            label="Log weight"
            onClick={() =>
              onLog(toStorage(draft), fatDraft > 0 ? fatDraft : undefined)
            }
          />
        </Row>
      </Card>

      <Card>
        <Heading text="Bodyweight over time" level="3" />
        <SingleLineChart
          data={trendData}
          dataKey="weight"
          label="Bodyweight"
          unit={unit}
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
