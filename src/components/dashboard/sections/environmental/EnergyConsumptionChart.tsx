
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricChart from '@/components/dashboard/MetricChart';

interface EnergyConsumptionChartProps {
  energyConsumption?: number;
  renewableEnergy?: number;
}

// This component has been emptied as requested, but kept for compatibility
const EnergyConsumptionChart: React.FC<EnergyConsumptionChartProps> = () => {
  const navigate = useNavigate();
  
  return (
    <MetricChart
      title="Consumo Energetico (B4)"
      description="Consumo energetico totale e fonti rinnovabili"
      type="empty"
      data={[]}
      dataKey="name"
      categories={["value"]}
      colors={["#F97316", "#34C759"]}
      individualColors={true}
      hideLegend={true}
      onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'energy' } })}
    />
  );
};

export default EnergyConsumptionChart;
