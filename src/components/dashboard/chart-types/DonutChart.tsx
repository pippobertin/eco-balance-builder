
import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Calculate reasonable size for the chart based on available height
  const calculateRadius = (baseHeight: number) => {
    const baseFactor = baseHeight / 300; // 300px is our reference height
    const outerRadius = Math.min(100, 80 * baseFactor);
    const innerRadius = Math.min(60, 40 * baseFactor);
    const middleRadius = Math.min(90, 70 * baseFactor);
    return { outerRadius, innerRadius, middleRadius };
  };
  
  const { outerRadius, innerRadius, middleRadius } = calculateRadius(height);
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 5, right: 5, bottom: 20, left: 5 }}>
        {ringData.map((ring) => (
          <Pie
            key={ring.ring}
            data={ring.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%" // Move chart up slightly to make room for legend
            innerRadius={ring.ring === 'inner' ? innerRadius : middleRadius}
            outerRadius={ring.ring === 'inner' ? middleRadius : outerRadius}
            paddingAngle={2}
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
        {!hideLegend && <Legend content={renderCustomLegend} verticalAlign="bottom" height={36} />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChartComponent;
