
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
  
  // Calculate reasonable size for the chart based on available height
  const calculateRadius = (baseHeight: number) => {
    const baseFactor = baseHeight / 300; // 300px is our reference height
    const outerRadius = Math.min(100, 80 * baseFactor);
    const innerRadius = Math.min(60, 40 * baseFactor);
    return { outerRadius, innerRadius };
  };
  
  const { outerRadius, innerRadius } = calculateRadius(height);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
        <Pie
          data={data as any[]}
          cx="50%"
          cy="45%" // Move chart up slightly to make room for legend
          labelLine={false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => height > 200 ? `${name} ${(percent * 100).toFixed(0)}%` : ""}
        >
          {(data as any[]).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip content={renderTooltip} />
        {!hideLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={30}
            formatter={(value) => <span style={{ fontSize: height < 250 ? '10px' : '12px' }}>{value}</span>}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
