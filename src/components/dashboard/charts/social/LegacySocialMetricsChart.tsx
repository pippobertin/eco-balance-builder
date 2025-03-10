
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

// Define the chart type using the correct type
type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface LegacySocialMetricsChartProps {
  reportData: ReportData;
}

const LegacySocialMetricsChart: React.FC<LegacySocialMetricsChartProps> = ({ reportData }) => {
  const hasLegacySocialData = 
    reportData.socialMetrics && 
    ((typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) || 
     (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0) || 
     (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) || 
     (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0));
  
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasLegacySocialData ? "bar" : "empty";
  
  if (hasLegacySocialData) {
    chartData = [
      { 
        name: 'Diversità di Genere', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeDiversity === 'number' 
          ? reportData.socialMetrics.employeeDiversity 
          : 0 
      },
      { 
        name: 'Soddisfazione Dipendenti', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeSatisfaction === 'number'
          ? reportData.socialMetrics.employeeSatisfaction 
          : 0 
      },
      { 
        name: 'Ore di Formazione', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.trainingHours === 'number'
          ? reportData.socialMetrics.trainingHours 
          : 0 
      },
      { 
        name: 'Impegno Comunitario', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.communityEngagement === 'number'
          ? reportData.socialMetrics.communityEngagement 
          : 0
      }
    ];
  }
  
  return (
    <MetricChart
      title="Diversità del Personale"
      description={hasLegacySocialData ? 
        "Metriche sociali generali" : 
        "Nessun dato di diversità disponibile"}
      type={chartType}
      data={chartData}
      dataKey="name"
      categories={['value']}
      colors={['#FF9500']}
      height={300}
    />
  );
};

export default LegacySocialMetricsChart;
