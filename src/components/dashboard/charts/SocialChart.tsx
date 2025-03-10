
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface SocialChartProps {
  reportData: ReportData;
}

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Create social data from actual values
  const socialData = [
    { 
      name: 'Diversità di Genere', 
      value: reportData.socialMetrics && reportData.socialMetrics.employeeDiversity > 0 
        ? reportData.socialMetrics.employeeDiversity 
        : 0 
    },
    { 
      name: 'Soddisfazione Dipendenti', 
      value: reportData.socialMetrics && reportData.socialMetrics.employeeSatisfaction > 0 
        ? reportData.socialMetrics.employeeSatisfaction 
        : 0 
    },
    { 
      name: 'Ore di Formazione', 
      value: reportData.socialMetrics && reportData.socialMetrics.trainingHours > 0 
        ? reportData.socialMetrics.trainingHours 
        : 0 
    },
    { 
      name: 'Impegno Comunitario', 
      value: reportData.socialMetrics && reportData.socialMetrics.communityEngagement > 0 
        ? reportData.socialMetrics.communityEngagement 
        : 0
    }
  ];
  
  // Check if there is any social data to show
  const hasSocialData = 
    (reportData.socialMetrics && reportData.socialMetrics.employeeDiversity > 0) || 
    (reportData.socialMetrics && reportData.socialMetrics.employeeSatisfaction > 0) || 
    (reportData.socialMetrics && reportData.socialMetrics.trainingHours > 0) || 
    (reportData.socialMetrics && reportData.socialMetrics.communityEngagement > 0);
  
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
