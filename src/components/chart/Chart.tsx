import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import "./Chart.css";
import type { ChartData } from "recharts/types/state/chartDataSlice";
import { Span } from "../text/Span";
import {
  capitalizeFirstLetter,
  splitAtCapitalLetter,
} from "../../helpers/string.helper";

type Props = {
  data: ChartData;
};

export const ChartComponent = ({ data }: Props) => {
  if (!data) {
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
        <Legend
          style={{ textTransform: "capitalize" }}
          formatter={(value: string) =>
            splitAtCapitalLetter(capitalizeFirstLetter(value))
          }
        />

        <Line
          type="monotone"
          dataKey="bench"
          stroke="#8884d8"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="squat"
          stroke="#82ca9d"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="overheadPress"
          stroke="#ffc658"
          strokeWidth={2}
          connectNulls
        />

        <Line
          type="monotone"
          dataKey="deadlift"
          stroke="#ff7300"
          strokeWidth={2}
          connectNulls
        />

        <RechartsDevtools />
      </LineChart>
    </div>
  );
};
