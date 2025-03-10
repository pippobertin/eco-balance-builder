import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

interface SocialChartProps {
  reportData: ReportData;
}

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Create social data from actual values only - no mock data
  const socialData = [
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
  
  // Check if there is any social data to show - explicit check for each value
  const hasSocialData = 
    reportData.socialMetrics && 
    ((typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) || 
     (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0) || 
     (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) || 
     (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0));
  
  return (
    <MetricChart
      title="Iniziative Sociali"
      description={hasSocialData ? 
        "Performance nelle dimensioni sociali" : 
        "Nessun dato sociale disponibile"}
      type={hasSocialData ? "bar" : "empty"}
      data={socialData}
      dataKey="name"
      categories={['value']}
      colors={['#FF9500']}
    />
  );
};

export default SocialChart;
