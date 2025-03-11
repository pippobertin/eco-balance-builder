
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface EnergyConsumptionChartProps {
  energyConsumption?: number;
  renewableEnergy?: number;
}

const EnergyConsumptionChart: React.FC<EnergyConsumptionChartProps> = ({
  energyConsumption,
  renewableEnergy
}) => {
  // Prepare data for energy consumption chart
  const energyData = [];
  
  if (energyConsumption || renewableEnergy) {
    if (energyConsumption !== undefined) {
      energyData.push({
        name: 'Consumo Totale',
        value: typeof energyConsumption === 'number' ? energyConsumption : 0
      });
    }
    
    if (renewableEnergy !== undefined) {
      energyData.push({
        name: 'Energia Rinnovabile',
        value: typeof renewableEnergy === 'number' ? renewableEnergy : 0
      });
    }
  }

  return (
    <MetricChart
      title="Consumo Energetico (B4)"
      description="Consumo energetico totale e fonti rinnovabili"
      type={energyData.length > 0 ? "bar" : "empty"}
      data={energyData}
      dataKey="name"
      categories={["value"]}
      colors={["#FF3B30", "#34C759"]}
    />
  );
};

export default EnergyConsumptionChart;
