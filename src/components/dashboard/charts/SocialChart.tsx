import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';

interface SocialChartProps {
  reportData: ReportData;
}

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Check if we have gender data
  const totalEmployees = reportData.socialMetrics?.totalEmployees || 0;
  const maleEmployees = reportData.socialMetrics?.maleEmployees || 0;
  const femaleEmployees = reportData.socialMetrics?.femaleEmployees || 0;
  const otherGenderEmployees = reportData.socialMetrics?.otherGenderEmployees || 0;
  const permanentEmployees = reportData.socialMetrics?.permanentEmployees || 0;
  
  const hasGenderData = totalEmployees > 0 && (maleEmployees > 0 || femaleEmployees > 0 || otherGenderEmployees > 0);
  
  // Format data for display
  let chartData = [];
  let chartType = "empty";
  
  if (hasGenderData) {
    // If we have gender data, create a pie chart
    chartData = [
      { name: 'Uomini', value: maleEmployees },
      { name: 'Donne', value: femaleEmployees },
      { name: 'Altri', value: otherGenderEmployees }
    ].filter(item => item.value > 0);
    
    chartType = "pie";
  } else {
    // Otherwise use the old social metrics
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
    
    // Check if there is any social data to show
    const hasSocialData = 
      reportData.socialMetrics && 
      ((typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) || 
       (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0) || 
       (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) || 
       (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0));
    
    chartType = hasSocialData ? "bar" : "empty";
  }
  
  const colors = ['#4299E1', '#F56565', '#ECC94B', '#38A169'];
  
  return (
    <MetricChart
      title="Diversità del Personale"
      description={hasGenderData ? 
        `Distribuzione di genere (${permanentEmployees} a tempo indeterminato)` : 
        "Nessun dato di diversità disponibile"}
      type={chartType}
      data={chartData}
      dataKey={hasGenderData ? "name" : "name"}
      categories={hasGenderData ? chartData.map(item => item.name) : ['value']}
      colors={hasGenderData ? colors.slice(0, chartData.length) : ['#FF9500']}
      height={300}
    />
  );
};

export default SocialChart;
