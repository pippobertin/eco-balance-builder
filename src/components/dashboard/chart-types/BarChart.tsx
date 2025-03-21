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
  
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Nessun dato disponibile</p>
      </div>
    );
  }
  
  const margins = {
    top: 20,
    right: 20,
    left: 20,
    bottom: hideLegend ? 20 : 40
  };
  
  const chartHeight = hideLegend ? height : height - 32;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ height: `${chartHeight}px`, minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            data={data as any[]} 
            margin={margins}
            barSize={20}
          >
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
            {individualColors ? (
              categories.map((category) => (
                <Bar key={category} dataKey={category} radius={[3, 3, 0, 0]}>
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
                  radius={[3, 3, 0, 0]}
                />
              ))
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
