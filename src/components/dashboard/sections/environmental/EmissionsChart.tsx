
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface EmissionsChartProps {
  totalScope1Emissions?: number;
  totalScope2Emissions?: number;
  totalScope3Emissions?: number;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({
  totalScope1Emissions,
  totalScope2Emissions,
  totalScope3Emissions
}) => {
  // Prepare data for emissions chart
  const emissionsData = [];
  
  if (totalScope1Emissions || totalScope2Emissions || totalScope3Emissions) {
    if (totalScope1Emissions !== undefined) {
      emissionsData.push({
        name: 'Scope 1',
        value: typeof totalScope1Emissions === 'number' ? totalScope1Emissions : 0
      });
    }
    
    if (totalScope2Emissions !== undefined) {
      emissionsData.push({
        name: 'Scope 2',
        value: typeof totalScope2Emissions === 'number' ? totalScope2Emissions : 0
      });
    }
    
    if (totalScope3Emissions !== undefined) {
      emissionsData.push({
        name: 'Scope 3',
        value: typeof totalScope3Emissions === 'number' ? totalScope3Emissions : 0
      });
    }
  }

  return (
    <MetricChart
      title="Emissioni GHG (B3)"
      description="Suddivisione delle emissioni di gas serra per scope"
      type={emissionsData.length > 0 ? "bar" : "empty"}
      data={emissionsData}
      dataKey="name"
      categories={["value"]}
      colors={["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#34C759"]}
      individualColors={true}
      hideLegend={true}
    />
  );
};

export default EmissionsChart;
