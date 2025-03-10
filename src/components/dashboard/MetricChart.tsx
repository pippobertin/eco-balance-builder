
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

// Define supported chart types
type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface MetricChartProps {
  title: string;
  description?: string;
  type: ChartType;
  data: any[];
  dataKey: string;
  categories?: string[];
  colors?: string[];
  height?: number;
}

const MetricChart = ({
  title,
  description,
  type,
  data,
  dataKey,
  categories = ['value'],
  colors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'],
  height = 300,
}: MetricChartProps) => {
  const defaultColors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'];
  const chartColors = colors.length > 0 ? colors : defaultColors;
  
  // Check if there's any non-zero data
  const hasData = data.some(item => 
    categories.some(category => 
      typeof item[category] === 'number' && item[category] > 0
    )
  );
  
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
      <p className="text-lg font-medium mb-2">Nessun dato disponibile</p>
      <p className="text-sm text-gray-400">Non sono presenti dati per questo grafico</p>
    </div>
  );
  
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                {categories.map((category, index) => (
                  <linearGradient key={index} id={`color-${category}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={renderTooltip} />
              {categories.map((category, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={category}
                  stroke={chartColors[index % chartColors.length]}
                  fillOpacity={1}
                  fill={`url(#color-${category})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={renderTooltip} />
              <Legend />
              {categories.map((category, index) => (
                <Bar
                  key={index}
                  dataKey={category}
                  fill={chartColors[index % chartColors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'empty':
        return renderEmptyState();
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  return (
    <GlassmorphicCard
      className="w-full"
      hover={false}
      header={
        <div className="space-y-1.5">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      }
    >
      <div className="pt-4">
        {type === 'empty' ? renderEmptyState() : renderChart()}
      </div>
    </GlassmorphicCard>
  );
};

export default MetricChart;
