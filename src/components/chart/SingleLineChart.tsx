import "./Chart.scss";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Span } from "../text/Span";

type SecondarySeries = {
  dataKey: string;
  label: string;
  unit?: string;
  color: string;
  domain?: [number, number];
};

type Props = {
  data: Record<string, string | number | undefined>[];
  dataKey: string;
  label: string;
  unit?: string;
  color: string;
  domain?: [number, number];
  secondary?: SecondarySeries;
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));

export const SingleLineChart = ({
  data,
  dataKey,
  label,
  unit,
  color,
  domain,
  secondary,
}: Props) => {
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
        <YAxis
          yAxisId="left"
          unit={unit ? ` ${unit}` : undefined}
          domain={domain}
          tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
        />
        {secondary && (
          <YAxis
            yAxisId="right"
            orientation="right"
            unit={secondary.unit ? ` ${secondary.unit}` : undefined}
            domain={secondary.domain}
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
        )}

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
        {secondary && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />}

        <Line
          yAxisId="left"
          type="monotone"
          dataKey={dataKey}
          name={label}
          stroke={color}
          strokeWidth={2}
          connectNulls
        />
        {secondary && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={secondary.dataKey}
            name={secondary.label}
            stroke={secondary.color}
            strokeWidth={2}
            connectNulls
          />
        )}
      </LineChart>
    </div>
  );
};
