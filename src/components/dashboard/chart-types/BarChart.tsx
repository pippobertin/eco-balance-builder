
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
  
  // Adjust margins based on height
  const margins = {
    top: 10,
    right: 10,
    left: 0,
    bottom: height < 250 ? 10 : 20
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data as any[]} 
        margin={margins}
        barSize={height < 200 ? 20 : 30} // Adjust bar size for smaller charts
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey={dataKey} 
          tick={{ fontSize: height < 250 ? 10 : 12 }} 
          axisLine={false} 
          tickLine={false}
          height={height < 200 ? 15 : 30}
          interval={0} // Show all ticks
          tickMargin={5}
        />
        <YAxis 
          tick={{ fontSize: height < 250 ? 10 : 12 }} 
          axisLine={false} 
          tickLine={false}
          width={25}
        />
        <Tooltip content={renderTooltip} />
        {!hideLegend && (
          <Legend 
            wrapperStyle={{ fontSize: height < 200 ? 10 : 12 }}
            verticalAlign="bottom"
            height={20}
          />
        )}
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
