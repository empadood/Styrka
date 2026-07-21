import "./BodyWeight.scss";

import { useState } from "react";

import { Button, Card, Heading, Input, Row, Stack } from "../../components";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import { buildBodyWeightTrendData } from "../../helpers/bodyweight.helper";
import type { BodyWeightEntry } from "../../types";

type Props = {
  log: BodyWeightEntry[];
  onLog: (weight: number) => void;
};

export const BodyWeight = ({ log, onLog }: Props) => {
  const [draft, setDraft] = useState(0);
  const trendData = buildBodyWeightTrendData(log);

  return (
    <Stack gap="lg" className="bodyweight__container">
      <Card>
        <Heading text="Log today's weight" level="3" />
        <Row gap="sm" className="bodyweight__form">
          <Input value={draft} size="medium" onChange={setDraft} />
          <Button label="Log weight" onClick={() => onLog(draft)} />
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
        />
      </Card>
    </Stack>
  );
};
