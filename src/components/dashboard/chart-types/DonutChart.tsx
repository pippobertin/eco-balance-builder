
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
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        {ringData.map((ring) => (
          <Pie
            key={ring.ring}
            data={ring.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={ring.ring === 'inner' ? 60 : 100}
            outerRadius={ring.ring === 'inner' ? 90 : 130}
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
        {!hideLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChartComponent;
