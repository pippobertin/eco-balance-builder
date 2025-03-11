
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartComponentProps } from './ChartTypes';

const AreaChartComponent: React.FC<ChartComponentProps> = ({
  data,
  dataKey,
  categories = ['value'],
  colors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'],
  height = 300,
  hideLegend = false,
  renderTooltip,
}) => {
  const chartColors = colors.length > 0 ? colors : ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data as any[]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {categories.map((category, index) => (
            <linearGradient key={index} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={renderTooltip} />
        {!hideLegend && <Legend />}
        {categories.map((category, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={category}
            stroke={chartColors[index % chartColors.length]}
            fillOpacity={1}
            fill={`url(#color-${category})`}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartComponent;
