
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

interface EnvironmentalChartProps {
  reportData: ReportData;
}

const EnvironmentalChart: React.FC<EnvironmentalChartProps> = ({ reportData }) => {
  // Get all the relevant environmental metrics
  const {
    carbonEmissions,
    energyConsumption,
    wasteGeneration,
    waterUsage,
    renewableEnergy
  } = reportData.environmentalMetrics || {};
  
  // Create data structure for the chart
  const environmentalData = [
    { 
      metric: 'Emissioni CO2', 
      value: typeof carbonEmissions === 'number' ? carbonEmissions : 0,
      color: '#FF3B30' // Red
    },
    { 
      metric: 'Consumo Energia', 
      value: typeof energyConsumption === 'number' ? energyConsumption : 0,
      color: '#FF9500' // Orange
    },
    { 
      metric: 'Generazione Rifiuti', 
      value: typeof wasteGeneration === 'number' ? wasteGeneration : 0,
      color: '#FFCC00' // Yellow
    },
    { 
      metric: 'Consumo Acqua', 
      value: typeof waterUsage === 'number' ? waterUsage : 0,
      color: '#5AC8FA' // Blue
    },
    { 
      metric: 'Energia Rinnovabile', 
      value: typeof renewableEnergy === 'number' ? renewableEnergy : 0,
      color: '#34C759' // Green
    }
  ];
  
  // Filter out metrics with zero values
  const filteredData = environmentalData.filter(item => item.value > 0);
  
  // Check if there is any data to display
  const hasEnvironmentalData = filteredData.length > 0;
  
  // Prepare data for bar chart
  const barChartData = hasEnvironmentalData ? 
    [{
      name: 'Metriche Ambientali',
      ...filteredData.reduce((acc, item) => {
        acc[item.metric] = item.value;
        return acc;
      }, {})
    }] : [];
  
  // Get categories and colors for the chart
  const categories = filteredData.map(item => item.metric);
  const colors = filteredData.map(item => item.color);
  
  return (
    <MetricChart
      title="Performance Ambientale"
      description={hasEnvironmentalData ? 
        "Indicatori ambientali chiave" : 
        "Nessun dato ambientale disponibile"}
      type={hasEnvironmentalData ? "bar" : "empty"}
      data={barChartData}
      dataKey="name"
      categories={categories}
      colors={colors}
      height={300}
    />
  );
};

export default EnvironmentalChart;
