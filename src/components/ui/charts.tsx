
import React from "react";
import {
  Bar,
  Line,
  Pie,
  BarChart as ReChartsBarChart,
  LineChart as ReChartsLineChart,
  PieChart as ReChartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer } from "./chart";

interface ChartProps {
  data: any;
  height?: number;
}

export const BarChart = ({ data, height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsBarChart data={data.labels.map((label: string, i: number) => ({
        name: label,
        ...data.datasets.reduce((acc: any, dataset: any, j: number) => {
          acc[dataset.label] = dataset.data[i];
          return acc;
        }, {})
      }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset: any, i: number) => (
          <Bar
            key={i}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
          />
        ))}
      </ReChartsBarChart>
    </ResponsiveContainer>
  );
};

export const LineChart = ({ data, height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsLineChart data={data.labels.map((label: string, i: number) => ({
        name: label,
        ...data.datasets.reduce((acc: any, dataset: any, j: number) => {
          acc[dataset.label] = dataset.data[i];
          return acc;
        }, {})
      }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset: any, i: number) => (
          <Line
            key={i}
            type="monotone"
            dataKey={dataset.label}
            stroke={dataset.borderColor || dataset.backgroundColor}
            fill={dataset.backgroundColor}
            activeDot={{ r: 8 }}
          />
        ))}
      </ReChartsLineChart>
    </ResponsiveContainer>
  );
};

export const PieChart = ({ data, height = 300 }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReChartsPieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={data.labels.map((label: string, i: number) => ({
            name: label,
            value: data.datasets[0].data[i],
          }))}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.labels.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={data.datasets[0].backgroundColor[index]} />
          ))}
        </Pie>
      </ReChartsPieChart>
    </ResponsiveContainer>
  );
};
