
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { ChartComponentProps } from './ChartTypes';

const PieChartComponent: React.FC<ChartComponentProps> = ({
  data,
  colors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'],
  height = 300,
  hideLegend = false,
  renderTooltip,
}) => {
  const chartColors = colors.length > 0 ? colors : ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'];
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data as any[]}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          innerRadius={60}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {(data as any[]).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        {!hideLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
