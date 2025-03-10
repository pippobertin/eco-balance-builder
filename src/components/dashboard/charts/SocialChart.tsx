
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/ReportContext';

interface SocialChartProps {
  reportData: ReportData;
}

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Create social data only with actually available values
  const socialData = [
    { 
      name: 'Diversità di Genere', 
      value: reportData.socialMetrics.employeeDiversity || 0 
    },
    { 
      name: 'Soddisfazione Dipendenti', 
      value: reportData.socialMetrics.employeeSatisfaction || 0 
    },
    { 
      name: 'Ore di Formazione', 
      value: reportData.socialMetrics.trainingHours || 0 
    },
    { 
      name: 'Impegno Comunitario', 
      value: reportData.socialMetrics.communityEngagement || 0 
    }
  ];
  
  // Check if there is data for this category
  const hasSocialData = reportData.socialMetrics.employeeDiversity > 0 || 
                        reportData.socialMetrics.employeeSatisfaction > 0 || 
                        reportData.socialMetrics.trainingHours > 0 || 
                        reportData.socialMetrics.communityEngagement > 0;
  
  return (
    <MetricChart
      title="Iniziative Sociali"
      description={hasSocialData ? 
        "Performance nelle dimensioni sociali" : 
        "Nessun dato sociale disponibile"}
      type="bar"
      data={socialData}
      dataKey="name"
      categories={['value']}
      colors={['#FF9500']}
    />
  );
};

export default SocialChart;
