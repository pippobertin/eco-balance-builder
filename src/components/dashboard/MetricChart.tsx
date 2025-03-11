import React from 'react';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import { ChartType, MetricChartProps, RingData } from './chart-types/ChartTypes';
import { renderEmptyState, createDefaultTooltip, hasValidData } from './chart-types/ChartUtils';
import AreaChartComponent from './chart-types/AreaChart';
import BarChartComponent from './chart-types/BarChart';
import PieChartComponent from './chart-types/PieChart';
import DonutChartComponent from './chart-types/DonutChart';

const MetricChart = ({
  title,
  description,
  type,
  data,
  dataKey,
  categories = ['value'],
  colors = ['#0A84FF', '#5AC8FA', '#34C759', '#FF9500', '#FF2D55'],
  individualColors = false,
  height = 300,
  hideLegend = false,
  tooltipFormatter,
}: MetricChartProps) => {
  const hasData = type !== 'empty' && 
    (Array.isArray(data) && data.length > 0 ? 
      ('ring' in data[0] ? 
        (data as RingData[]).some(ring => ring.data.length > 0) : 
        hasValidData(data as any[], categories)) : 
      false);
  
  const renderTooltip = (props: any) => createDefaultTooltip(props, tooltipFormatter);
  
  // Adjust chart height based on presence of description and legend
  const calculateChartHeight = () => {
    let baseHeight = height;
    if (description) baseHeight -= 24; // Reduced space for description
    if (!hideLegend) baseHeight -= 32; // Reduced space for legend
    return Math.max(220, baseHeight); // Increased minimum height
  };
  
  const chartHeight = calculateChartHeight();
  
  const renderChart = () => {
    if (!hasData && type !== 'empty') {
      return renderEmptyState();
    }
    
    switch (type) {
      case 'donut':
        return (
          <DonutChartComponent
            data={data}
            dataKey={dataKey}
            categories={categories}
            colors={colors}
            individualColors={individualColors}
            height={chartHeight}
            hideLegend={hideLegend}
            renderTooltip={renderTooltip}
          />
        );
      
      case 'area':
        return (
          <AreaChartComponent
            data={data as any[]}
            dataKey={dataKey}
            categories={categories}
            colors={colors}
            height={chartHeight}
            hideLegend={hideLegend}
            renderTooltip={renderTooltip}
          />
        );
      
      case 'bar':
        return (
          <BarChartComponent
            data={data as any[]}
            dataKey={dataKey}
            categories={categories}
            colors={colors}
            individualColors={individualColors}
            height={chartHeight}
            hideLegend={hideLegend}
            renderTooltip={renderTooltip}
          />
        );
      
      case 'pie':
        return (
          <PieChartComponent
            data={data as any[]}
            dataKey={dataKey}
            categories={categories}
            colors={colors}
            height={chartHeight}
            hideLegend={hideLegend}
            renderTooltip={renderTooltip}
          />
        );
      
      case 'empty':
        return renderEmptyState();
        
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  return (
    <GlassmorphicCard
      className="w-full h-full"
      hover={false}
      header={
        <div className="space-y-1.5">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      }
    >
      <div className="pt-1 pb-1 h-full">
        {renderChart()}
      </div>
    </GlassmorphicCard>
  );
};

export default MetricChart;
