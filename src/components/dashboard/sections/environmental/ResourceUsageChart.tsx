
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface ResourceUsageChartProps {
  waterUsage?: number;
  wasteGeneration?: number;
}

const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({
  waterUsage,
  wasteGeneration
}) => {
  // Prepare data for resource usage chart
  const resourceData = [];
  
  if (waterUsage || wasteGeneration) {
    if (waterUsage !== undefined) {
      resourceData.push({
        name: 'Utilizzo Acqua',
        value: typeof waterUsage === 'number' ? waterUsage : 0
      });
    }
    
    if (wasteGeneration !== undefined) {
      resourceData.push({
        name: 'Generazione Rifiuti',
        value: typeof wasteGeneration === 'number' ? wasteGeneration : 0
      });
    }
  }

  return (
    <MetricChart
      title="Acqua e Rifiuti (B5-B7)"
      description="Utilizzo di acqua e generazione di rifiuti"
      type={resourceData.length > 0 ? "bar" : "empty"}
      data={resourceData}
      dataKey="name"
      categories={["value"]}
      colors={["#5AC8FA", "#FF9500", "#D946EF", "#0EA5E9"]}
      individualColors={true}
    />
  );
};

export default ResourceUsageChart;
