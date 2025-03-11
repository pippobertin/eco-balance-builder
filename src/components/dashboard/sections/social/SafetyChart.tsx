
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricChart from '@/components/dashboard/MetricChart';

interface SafetyChartProps {
  employeeTurnover?: number;
  workAccidents?: number;
}

const SafetyChart: React.FC<SafetyChartProps> = ({
  employeeTurnover,
  workAccidents
}) => {
  const navigate = useNavigate();
  
  // Prepare data for safety chart
  const safetyData = [];
  
  if (employeeTurnover || workAccidents) {
    if (employeeTurnover) {
      safetyData.push({
        name: 'Turnover',
        value: typeof employeeTurnover === 'number' ? employeeTurnover : 
               typeof employeeTurnover === 'string' ? parseFloat(employeeTurnover) || 0 : 0
      });
    }
    
    if (workAccidents) {
      safetyData.push({
        name: 'Incidenti',
        value: typeof workAccidents === 'number' ? workAccidents : 
               typeof workAccidents === 'string' ? parseInt(workAccidents, 10) || 0 : 0
      });
    }
  }
  
  const handleTitleClick = () => {
    navigate('/report', { state: { section: 'social', field: 'safetyInfo' } });
  };

  return (
    <MetricChart
      title="Turnover e Sicurezza"
      description="Indicatori di turnover e sicurezza sul lavoro"
      type={safetyData.length > 0 ? "bar" : "empty"}
      data={safetyData}
      dataKey="name"
      categories={["value"]}
      colors={["#FF9500", "#FF3B30", "#9B87F5", "#34C759"]}
      individualColors={true}
      hideLegend={true}
      onTitleClick={handleTitleClick}
    />
  );
};

export default SafetyChart;
