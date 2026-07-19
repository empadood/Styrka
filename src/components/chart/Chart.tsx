import "./Chart.css";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type ChartData, EXERCISE_LABELS } from "../../types";
import { Span } from "../text/Span";

type Props = {
  data: ChartData[];
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));

export const ChartComponent = ({ data }: Props) => {
  if (data.length === 0) {
    return (
      <div>
        <Span text="No data available" />
      </div>
    );
  }
  return (
    <div className="chart__container">
      <LineChart
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "25vh",
          aspectRatio: 1.618,
          alignContent: "center",
          alignItems: "center",
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

        <XAxis
          dataKey="date"
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          tickFormatter={formatDate}
          tickMargin={8}
          padding={{ left: 16, right: 16 }}
        />
        <YAxis unit=" kg" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />

        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          cursor={{
            stroke: "var(--primary)",
          }}
          contentStyle={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            borderRadius: 12,
            boxShadow: "0 0.5rem 1.5rem rgba(31, 41, 51, 0.12)",
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />

        <Line
          type="monotone"
          dataKey="benchpress"
          name={EXERCISE_LABELS.benchpress}
          stroke="var(--primary)"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="squat"
          name={EXERCISE_LABELS.squat}
          stroke="var(--success)"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="ohp"
          name={EXERCISE_LABELS.ohp}
          stroke="var(--warning)"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="deadlift"
          name={EXERCISE_LABELS.deadlift}
          stroke="var(--danger)"
          strokeWidth={2}
          connectNulls
        />
      </LineChart>
    </div>
  );
};
