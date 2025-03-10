
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface PerformanceDistributionChartProps {
  reportData: ReportData;
}

const PerformanceDistributionChart: React.FC<PerformanceDistributionChartProps> = ({ reportData }) => {
  // Use only real values for performance data
  const environmentalValue = 
    (reportData.environmentalMetrics && reportData.environmentalMetrics.carbonEmissions > 0) || 
    (reportData.environmentalMetrics && reportData.environmentalMetrics.renewableEnergy > 0)
      ? Math.round(
          ((reportData.environmentalMetrics?.renewableEnergy || 0) + 
           (100 - (reportData.environmentalMetrics?.carbonEmissions || 0))) / 2
        )
      : 0;
  
  const socialValue = 
    (reportData.socialMetrics && reportData.socialMetrics.employeeDiversity > 0) || 
    (reportData.socialMetrics && reportData.socialMetrics.employeeSatisfaction > 0)
      ? Math.round(
          ((reportData.socialMetrics?.employeeDiversity || 0) + 
           (reportData.socialMetrics?.employeeSatisfaction || 0)) / 2
        )
      : 0;
  
  const governanceValue = 
    reportData.conductMetrics && reportData.conductMetrics.governanceCompliance > 0
      ? reportData.conductMetrics.governanceCompliance
      : 0;
  
  const performanceData = [
    { name: 'Ambientale', value: environmentalValue },
    { name: 'Sociale', value: socialValue },
    { name: 'Governance', value: governanceValue },
  ];
  
  const hasPerformanceData = performanceData.some(item => item.value > 0);
  
  return (
    <MetricChart
      title="Distribuzione Punteggio ESG"
      description={hasPerformanceData ? 
        "Performance nelle dimensioni ESG" : 
        "Nessun dato di performance ESG disponibile"}
      type={hasPerformanceData ? "pie" : "empty"}
      data={performanceData}
      dataKey="name"
      colors={['#30D158', '#FF9F0A', '#5E5CE6']}
    />
  );
};

export default PerformanceDistributionChart;
