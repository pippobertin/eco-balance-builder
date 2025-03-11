
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
  
  if (!Array.isArray(ringData) || ringData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Nessun dato disponibile</p>
      </div>
    );
  }
  
  const renderCustomLegend = () => {
    const legendItems = ringData.flatMap(ring => 
      ring.data.map((item, index) => ({
        name: item.name,
        color: ring.colors[index % ring.colors.length]
      }))
    );
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {legendItems.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1.5" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };
  
  const calculateRadius = (baseHeight: number) => {
    const baseFactor = baseHeight / 300;
    // Increase the size of both radii for thicker rings
    const outerRadius = Math.min(120, 95 * baseFactor);
    const innerRadius = Math.min(100, 75 * baseFactor);
    // Increase the gap between rings by making the middle radius further from inner
    const middleRadius = Math.min(110, 85 * baseFactor);
    return { outerRadius, innerRadius, middleRadius };
  };
  
  const { outerRadius, innerRadius, middleRadius } = calculateRadius(height);
  
  const chartHeight = hideLegend ? height : height - 40;
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow" style={{ height: `${chartHeight}px` }}>
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
                paddingAngle={2} // Increased padding angle for better separation
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
        <div className="h-12 mt-2">
          {renderCustomLegend()}
        </div>
      )}
    </div>
  );
};

export default DonutChartComponent;
