
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface EnvironmentalChartProps {
  reportData: ReportData;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ reportData }) => {
  // Create empty data structure - NO MOCK DATA, only structure
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
  
  // Check if there is any data to display - explicit check for each value
  const hasEnvironmentalData = 
    reportData.environmentalMetrics && 
    ((typeof reportData.environmentalMetrics.carbonEmissions === 'number' && reportData.environmentalMetrics.carbonEmissions > 0) || 
     (typeof reportData.environmentalMetrics.wasteGeneration === 'number' && reportData.environmentalMetrics.wasteGeneration > 0) || 
     (typeof reportData.environmentalMetrics.energyConsumption === 'number' && reportData.environmentalMetrics.energyConsumption > 0));
  
  // Only populate if we have actual data
  if (hasEnvironmentalData) {
    if (reportData.environmentalMetrics.carbonEmissions) {
      environmentalData[11].emissions = reportData.environmentalMetrics.carbonEmissions;
    }
    
    if (reportData.environmentalMetrics.wasteGeneration) {
      environmentalData[11].waste = reportData.environmentalMetrics.wasteGeneration;
    }
    
    if (reportData.environmentalMetrics.energyConsumption) {
      environmentalData[11].energy = reportData.environmentalMetrics.energyConsumption / 30;
    }
  }
  
  return (
    <MetricChart
      title="Performance Ambientale"
      description={hasEnvironmentalData ? 
        "Monitoraggio mensile degli indicatori ambientali chiave" : 
        "Nessun dato ambientale disponibile"}
      type={hasEnvironmentalData ? "area" : "empty"}
      data={environmentalData}
      dataKey="month"
      categories={['emissions', 'waste', 'energy']}
      colors={['#0A84FF', '#34C759', '#5AC8FA']}
    />
  );
};

export default EnvironmentalChart;
