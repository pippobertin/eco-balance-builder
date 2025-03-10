
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface PerformanceDistributionChartProps {
  reportData: ReportData;
}

const PerformanceDistributionChart: React.FC<PerformanceDistributionChartProps> = ({ reportData }) => {
  // Calculate values only from real data, with explicit type checks
  let environmentalValue = 0;
  let socialValue = 0;
  let governanceValue = 0;
  
  // Only calculate if we have actual data
  if (reportData.environmentalMetrics) {
    const hasRenewableEnergy = typeof reportData.environmentalMetrics.renewableEnergy === 'number' && 
                              reportData.environmentalMetrics.renewableEnergy > 0;
    
    const hasCarbonEmissions = typeof reportData.environmentalMetrics.carbonEmissions === 'number' && 
                              reportData.environmentalMetrics.carbonEmissions > 0;
    
    if (hasRenewableEnergy || hasCarbonEmissions) {
      const renewableValue = hasRenewableEnergy ? reportData.environmentalMetrics.renewableEnergy : 0;
      const carbonValue = hasCarbonEmissions ? 100 - reportData.environmentalMetrics.carbonEmissions : 0;
      
      if (hasRenewableEnergy && hasCarbonEmissions) {
        environmentalValue = Math.round((renewableValue + carbonValue) / 2);
      } else if (hasRenewableEnergy) {
        environmentalValue = renewableValue;
      } else if (hasCarbonEmissions) {
        environmentalValue = carbonValue;
      }
    }
  }
  
  if (reportData.socialMetrics) {
    const hasDiversity = typeof reportData.socialMetrics.employeeDiversity === 'number' && 
                        reportData.socialMetrics.employeeDiversity > 0;
    
    const hasSatisfaction = typeof reportData.socialMetrics.employeeSatisfaction === 'number' && 
                           reportData.socialMetrics.employeeSatisfaction > 0;
    
    if (hasDiversity || hasSatisfaction) {
      const diversityValue = hasDiversity ? reportData.socialMetrics.employeeDiversity : 0;
      const satisfactionValue = hasSatisfaction ? reportData.socialMetrics.employeeSatisfaction : 0;
      
      if (hasDiversity && hasSatisfaction) {
        socialValue = Math.round((diversityValue + satisfactionValue) / 2);
      } else if (hasDiversity) {
        socialValue = diversityValue;
      } else if (hasSatisfaction) {
        socialValue = satisfactionValue;
      }
    }
  }
  
  if (reportData.conductMetrics && 
      typeof reportData.conductMetrics.governanceCompliance === 'number' && 
      reportData.conductMetrics.governanceCompliance > 0) {
    governanceValue = reportData.conductMetrics.governanceCompliance;
  }
  
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
