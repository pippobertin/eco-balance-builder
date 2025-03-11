
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
    const baseFactor = baseHeight / 300;
    const outerRadius = Math.min(90, 70 * baseFactor);
    const innerRadius = Math.min(45, 35 * baseFactor);
    return { outerRadius, innerRadius };
  };
  
  const { outerRadius, innerRadius } = calculateRadius(height);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ minHeight: height - 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data as any[]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              paddingAngle={2}
              strokeWidth={0.5}
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
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
