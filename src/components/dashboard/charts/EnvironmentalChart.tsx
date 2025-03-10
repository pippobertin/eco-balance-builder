
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface EnvironmentalChartProps {
  reportData: ReportData;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ reportData }) => {
  // Create environmental data with real values or zeros
  const environmentalData = [
    { month: 'Gen', emissions: 0, waste: 0, energy: 0 },
    { month: 'Feb', emissions: 0, waste: 0, energy: 0 },
    { month: 'Mar', emissions: 0, waste: 0, energy: 0 },
    { month: 'Apr', emissions: 0, waste: 0, energy: 0 },
    { month: 'Mag', emissions: 0, waste: 0, energy: 0 },
    { month: 'Giu', emissions: 0, waste: 0, energy: 0 },
    { month: 'Lug', emissions: 0, waste: 0, energy: 0 },
    { month: 'Ago', emissions: 0, waste: 0, energy: 0 },
    { month: 'Set', emissions: 0, waste: 0, energy: 0 },
    { month: 'Ott', emissions: 0, waste: 0, energy: 0 },
    { month: 'Nov', emissions: 0, waste: 0, energy: 0 },
    { month: 'Dic', emissions: 0, waste: 0, energy: 0 },
  ];
  
  // Use only the data actually available
  if (reportData.environmentalMetrics.carbonEmissions) {
    environmentalData[11].emissions = reportData.environmentalMetrics.carbonEmissions;
  }
  if (reportData.environmentalMetrics.wasteGeneration) {
    environmentalData[11].waste = reportData.environmentalMetrics.wasteGeneration;
  }
  if (reportData.environmentalMetrics.energyConsumption) {
    environmentalData[11].energy = reportData.environmentalMetrics.energyConsumption / 30;
  }
  
  // Check if there is data for this category
  const hasEnvironmentalData = reportData.environmentalMetrics.carbonEmissions > 0 || 
                              reportData.environmentalMetrics.wasteGeneration > 0 || 
                              reportData.environmentalMetrics.energyConsumption > 0;
  
  return (
    <MetricChart
      title="Performance Ambientale"
      description={hasEnvironmentalData ? 
        "Monitoraggio mensile degli indicatori ambientali chiave" : 
        "Nessun dato ambientale disponibile"}
      type="area"
      data={environmentalData}
      dataKey="month"
      categories={['emissions', 'waste', 'energy']}
      colors={['#0A84FF', '#34C759', '#5AC8FA']}
    />
  );
};

export default EnvironmentalChart;
