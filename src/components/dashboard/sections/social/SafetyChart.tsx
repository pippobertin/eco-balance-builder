
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface SafetyChartProps {
  employeeTurnover?: number;
  workAccidents?: number;
}

const SafetyChart: React.FC<SafetyChartProps> = ({
  employeeTurnover,
  workAccidents
}) => {
  // Prepare data for safety chart
  const safetyData = [];
  
  if (employeeTurnover || workAccidents) {
    if (employeeTurnover) {
      safetyData.push({
        name: 'Turnover Dipendenti',
        value: typeof employeeTurnover === 'number' ? employeeTurnover : 
               typeof employeeTurnover === 'string' ? parseFloat(employeeTurnover) || 0 : 0
      });
    }
    
    if (workAccidents) {
      safetyData.push({
        name: 'Incidenti sul Lavoro',
        value: typeof workAccidents === 'number' ? workAccidents : 
               typeof workAccidents === 'string' ? parseInt(workAccidents, 10) || 0 : 0
      });
    }
  }

  return (
    <MetricChart
      title="Turnover e Sicurezza"
      description="Indicatori di turnover e sicurezza sul lavoro"
      type={safetyData.length > 0 ? "bar" : "empty"}
      data={safetyData}
      dataKey="name"
      categories={["value"]}
      colors={["#FF9500", "#FF3B30"]}
    />
  );
};

export default SafetyChart;
