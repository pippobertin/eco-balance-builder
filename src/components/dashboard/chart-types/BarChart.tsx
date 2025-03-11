
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { ChartComponentProps } from './ChartTypes';

const BarChartComponent: React.FC<ChartComponentProps> = ({
  data,
  dataKey,
  categories = ['value'],
  colors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'],
  individualColors = false,
  height = 300,
  hideLegend = false,
  renderTooltip,
}) => {
  const chartColors = colors.length > 0 ? colors : ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data as any[]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={renderTooltip} />
        {!hideLegend && <Legend />}
        {individualColors ? (
          categories.map((category) => (
            <Bar key={category} dataKey={category} radius={[4, 4, 0, 0]}>
              {(data as any[]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          ))
        ) : (
          categories.map((category, index) => (
            <Bar
              key={index}
              dataKey={category}
              fill={chartColors[index % chartColors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
