
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface PerformanceDistributionChartProps {
  reportData: ReportData;
}

const PerformanceDistributionChart: React.FC<PerformanceDistributionChartProps> = ({ reportData }) => {
  // Use only real values for performance data
  const performanceData = [
    { 
      name: 'Ambientale', 
      value: reportData.environmentalMetrics.carbonEmissions > 0 || 
             reportData.environmentalMetrics.renewableEnergy > 0 ? 
             Math.round((reportData.environmentalMetrics.renewableEnergy || 0) + 
                        (100 - (reportData.environmentalMetrics.carbonEmissions || 0))) / 2 : 0 
    },
    { 
      name: 'Sociale', 
      value: reportData.socialMetrics.employeeDiversity > 0 || 
             reportData.socialMetrics.employeeSatisfaction > 0 ? 
             Math.round((reportData.socialMetrics.employeeDiversity || 0) + 
                        (reportData.socialMetrics.employeeSatisfaction || 0)) / 2 : 0 
    },
    { 
      name: 'Governance', 
      value: reportData.conductMetrics.governanceCompliance || 0 
    },
  ];
  
  const hasPerformanceData = performanceData.some(item => item.value > 0);
  
  return (
    <MetricChart
      title="Distribuzione Punteggio ESG"
      description={hasPerformanceData ? 
        "Performance nelle dimensioni ESG" : 
        "Nessun dato di performance ESG disponibile"}
      type="pie"
      data={performanceData}
      dataKey="name"
      colors={['#30D158', '#FF9F0A', '#5E5CE6']}
    />
  );
};

export default PerformanceDistributionChart;
