
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface GovernanceChartProps {
  reportData: ReportData;
}

const GovernanceChart: React.FC<GovernanceChartProps> = ({ reportData }) => {
  // Create governance data only with actually available values
  const governanceData = [
    { 
      quarter: 'Q1', 
      compliance: reportData.conductMetrics && reportData.conductMetrics.governanceCompliance > 0 
        ? reportData.conductMetrics.governanceCompliance 
        : 0,
      risk: reportData.conductMetrics && reportData.conductMetrics.riskManagement > 0 
        ? reportData.conductMetrics.riskManagement 
        : 0,
      policy: reportData.conductMetrics && reportData.conductMetrics.policyAdherence > 0 
        ? reportData.conductMetrics.policyAdherence 
        : 0
    },
    { quarter: 'Q2', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q3', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q4', compliance: 0, risk: 0, policy: 0 },
  ];
  
  // Check if there is data for this category
  const hasGovernanceData = 
    (reportData.conductMetrics && reportData.conductMetrics.governanceCompliance > 0) || 
    (reportData.conductMetrics && reportData.conductMetrics.policyAdherence > 0) || 
    (reportData.conductMetrics && reportData.conductMetrics.riskManagement > 0);
  
  return (
    <MetricChart
      title="Metriche di Governance"
      description={hasGovernanceData ? 
        "Performance di governance trimestrale" : 
        "Nessun dato di governance disponibile"}
      type={hasGovernanceData ? "area" : "empty"}
      data={governanceData}
      dataKey="quarter"
      categories={['compliance', 'risk', 'policy']}
      colors={['#64D2FF', '#FF2D55', '#BF5AF2']}
    />
  );
};

export default GovernanceChart;
