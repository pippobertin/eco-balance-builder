
import React from 'react';
import { Briefcase } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

interface EmploymentTypeChartProps {
  permanentEmployees: number;
  temporaryEmployees: number;
}

const EmploymentTypeChart: React.FC<EmploymentTypeChartProps> = ({
  permanentEmployees,
  temporaryEmployees
}) => {
  const hasData = permanentEmployees > 0 || temporaryEmployees > 0;
  
  // Format data for employment type
  let chartData = [];
  let chartType = hasData ? "pie" : "empty";
  
  if (hasData) {
    chartData = [
      { name: 'Indeterminato', value: permanentEmployees },
      { name: 'Determinato', value: temporaryEmployees }
    ].filter(item => item.value > 0);
  }
  
  // Colors for the chart
  const colors = ['#38A169', '#F56565'];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-green-500" />
        <h4 className="text-sm font-medium">Tipo di Contratto</h4>
      </div>
      <div className="h-[200px]">
        <MetricChart
          title=""
          type={chartType}
          data={chartData}
          dataKey="name"
          categories={["value"]}
          colors={colors}
          height={200}
        />
      </div>
    </div>
  );
};

export default EmploymentTypeChart;
