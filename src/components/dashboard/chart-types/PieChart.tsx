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
  
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Nessun dato disponibile</p>
      </div>
    );
  }
  
  const calculateRadius = (baseHeight: number) => {
    const baseFactor = baseHeight / 300;
    const outerRadius = Math.min(100, 80 * baseFactor);
    const innerRadius = Math.min(50, 40 * baseFactor);
    return { outerRadius, innerRadius };
  };
  
  const { outerRadius, innerRadius } = calculateRadius(height);
  
  const chartHeight = hideLegend ? height : height - 32;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ height: `${chartHeight}px`, minHeight: '220px' }}>
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
