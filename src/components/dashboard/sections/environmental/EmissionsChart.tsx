
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
  // Calculate total emissions
  const total = [totalScope1Emissions, totalScope2Emissions, totalScope3Emissions]
    .filter((val): val is number => typeof val === 'number')
    .reduce((sum, val) => sum + val, 0);

  // Prepare data for emissions chart - inner ring (breakdown by scope)
  const scopeData = [];
  
  if (totalScope1Emissions || totalScope2Emissions || totalScope3Emissions) {
    if (totalScope1Emissions !== undefined) {
      scopeData.push({
        name: 'Scope 1',
        value: typeof totalScope1Emissions === 'number' ? totalScope1Emissions : 0
      });
    }
    
    if (totalScope2Emissions !== undefined) {
      scopeData.push({
        name: 'Scope 2',
        value: typeof totalScope2Emissions === 'number' ? totalScope2Emissions : 0
      });
    }
    
    if (totalScope3Emissions !== undefined) {
      scopeData.push({
        name: 'Scope 3',
        value: typeof totalScope3Emissions === 'number' ? totalScope3Emissions : 0
      });
    }
  }

  // Prepare outer ring data (total emissions)
  const totalData = total > 0 ? [
    {
      name: 'Totale Emissioni',
      value: total
    }
  ] : [];

  // Use a softer color palette
  const innerColors = ['#D946EF', '#F97316', '#0EA5E9'];
  const outerColors = ['#8B5CF6'];

  return (
    <MetricChart
      title="Emissioni GHG (B3)"
      description="Emissioni di gas serra per scope e totali"
      type="donut"
      data={[
        { ring: 'inner', data: scopeData, colors: innerColors },
        { ring: 'outer', data: totalData, colors: outerColors }
      ]}
      dataKey="name"
      hideLegend={true}
    />
  );
};

export default EmissionsChart;

