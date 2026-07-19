import "./Chart.css";

import { RechartsDevtools } from "@recharts/devtools";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type ChartData,EXERCISE_LABELS } from "../../types";
import { Span } from "../text/Span";

type Props = {
  data: ChartData[];
};

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
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255, 255, 255, 0.2)"
        />

        <XAxis
          dataKey="workout"
          label=""
          hide
          padding={{ left: 16, right: 16 }}
        />
        <YAxis unit=" kg" />

        <Tooltip
          cursor={{
            stroke: "white",
          }}
          contentStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.94)",
            borderColor: "white",
            textTransform: "capitalize",
          }}
        />
        <Legend style={{ textTransform: "capitalize" }} />

        <Line
          type="monotone"
          dataKey="benchpress"
          name={EXERCISE_LABELS.benchpress}
          stroke="#8884d8"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="squat"
          name={EXERCISE_LABELS.squat}
          stroke="#82ca9d"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="ohp"
          name={EXERCISE_LABELS.ohp}
          stroke="#ffc658"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="deadlift"
          name={EXERCISE_LABELS.deadlift}
          stroke="#ff7300"
          strokeWidth={2}
          connectNulls
        />

        <RechartsDevtools />
      </LineChart>
    </div>
  );
};
