import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

interface GovernanceChartProps {
  reportData: ReportData;
}

const GovernanceChart: React.FC<GovernanceChartProps> = ({ reportData }) => {
  // Create governance data only with actually available values - no mock data
  const governanceData = [
    { 
      quarter: 'Q1', 
      compliance: 0,
      risk: 0,
      policy: 0
    },
    { quarter: 'Q2', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q3', compliance: 0, risk: 0, policy: 0 },
    { quarter: 'Q4', compliance: 0, risk: 0, policy: 0 },
  ];
  
  // Check if there is data for this category - explicit check for each value
  const hasGovernanceData = 
    reportData.conductMetrics && 
    ((typeof reportData.conductMetrics.governanceCompliance === 'number' && reportData.conductMetrics.governanceCompliance > 0) || 
     (typeof reportData.conductMetrics.policyAdherence === 'number' && reportData.conductMetrics.policyAdherence > 0) || 
     (typeof reportData.conductMetrics.riskManagement === 'number' && reportData.conductMetrics.riskManagement > 0));
  
  // Only populate if we have actual data
  if (hasGovernanceData) {
    if (typeof reportData.conductMetrics.governanceCompliance === 'number') {
      governanceData[0].compliance = reportData.conductMetrics.governanceCompliance;
    }
    
    if (typeof reportData.conductMetrics.riskManagement === 'number') {
      governanceData[0].risk = reportData.conductMetrics.riskManagement;
    }
    
    if (typeof reportData.conductMetrics.policyAdherence === 'number') {
      governanceData[0].policy = reportData.conductMetrics.policyAdherence;
    }
  }
  
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
