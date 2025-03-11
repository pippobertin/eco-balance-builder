
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
  
  // Ensure we have valid data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Nessun dato disponibile</p>
      </div>
    );
  }
  
  const margins = {
    top: 5,
    right: 5,
    left: 0,
    bottom: hideLegend ? 5 : 25
  };
  
  // Adjust chart height based on legend visibility
  const chartHeight = hideLegend ? height : height - 40;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data as any[]} margin={margins}>
            <defs>
              {categories.map((category, index) => (
                <linearGradient key={index} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey={dataKey} 
              tick={{ fontSize: 11 }} 
              axisLine={false} 
              tickLine={false}
              interval={0}
              tickMargin={5}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false} 
              tickLine={false}
              width={30}
            />
            <Tooltip content={renderTooltip} />
            {!hideLegend && (
              <Legend 
                wrapperStyle={{ fontSize: 11, marginTop: '10px' }}
                verticalAlign="bottom"
                height={30}
              />
            )}
            {categories.map((category, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={category}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#color-${category})`}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaChartComponent;
