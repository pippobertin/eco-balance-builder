
import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartComponentProps, RingData } from './ChartTypes';

const DonutChartComponent: React.FC<ChartComponentProps> = ({
  data,
  height = 300,
  hideLegend = false,
  renderTooltip,
}) => {
  const ringData = data as RingData[];
  
  // Custom legend that renders colored squares
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 -mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-2.5 h-2.5 mr-1.5" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Calculate reasonable size for the chart based on available height
  const calculateRadius = (baseHeight: number) => {
    const baseFactor = baseHeight / 300;
    const outerRadius = Math.min(95, 75 * baseFactor);
    const innerRadius = Math.min(75, 55 * baseFactor);
    const middleRadius = Math.min(85, 65 * baseFactor);
    return { outerRadius, innerRadius, middleRadius };
  };
  
  const { outerRadius, innerRadius, middleRadius } = calculateRadius(height);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ minHeight: height - 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            {ringData.map((ring) => (
              <Pie
                key={ring.ring}
                data={ring.data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={ring.ring === 'inner' ? innerRadius : middleRadius}
                outerRadius={ring.ring === 'inner' ? middleRadius : outerRadius}
                paddingAngle={1}
                strokeWidth={0.5}
              >
                {ring.data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={ring.colors[index % ring.colors.length]}
                  />
                ))}
              </Pie>
            ))}
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {!hideLegend && (
        <div className="h-12 flex items-center justify-center">
          {renderCustomLegend({ payload: ringData.flatMap(ring => 
            ring.data.map((item, index) => ({
              value: item.name,
              color: ring.colors[index % ring.colors.length]
            }))
          )})}
        </div>
      )}
    </div>
  );
};

export default DonutChartComponent;
