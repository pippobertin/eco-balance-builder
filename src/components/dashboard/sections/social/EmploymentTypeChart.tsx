
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface EmploymentTypeChartProps {
  fullTimeEmployees?: number;
  partTimeEmployees?: number;
}

const EmploymentTypeChart: React.FC<EmploymentTypeChartProps> = ({
  fullTimeEmployees,
  partTimeEmployees
}) => {
  // Prepare data for employment type chart
  const employmentData = [];
  
  if (fullTimeEmployees || partTimeEmployees) {
    if (fullTimeEmployees) {
      employmentData.push({
        name: 'Full-Time',
        value: typeof fullTimeEmployees === 'number' ? fullTimeEmployees : 
               typeof fullTimeEmployees === 'string' ? parseInt(fullTimeEmployees, 10) || 0 : 0
      });
    }
    
    if (partTimeEmployees) {
      employmentData.push({
        name: 'Part-Time',
        value: typeof partTimeEmployees === 'number' ? partTimeEmployees : 
               typeof partTimeEmployees === 'string' ? parseInt(partTimeEmployees, 10) || 0 : 0
      });
    }
  }

  return (
    <MetricChart
      title="Tipo di Impiego"
      description="Distribuzione full-time vs part-time"
      type={employmentData.length > 0 ? "bar" : "empty"}
      data={employmentData}
      dataKey="name"
      categories={["value"]}
      colors={["#007AFF", "#5856D6", "#D946EF", "#F97316"]}
      individualColors={true}
      hideLegend={true}
    />
  );
};

export default EmploymentTypeChart;
