
import React from 'react';
import { Briefcase, Info } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface EmploymentTypeChartProps {
  permanentEmployees: number | string;
  temporaryEmployees: number | string;
}

const EmploymentTypeChart: React.FC<EmploymentTypeChartProps> = ({
  permanentEmployees,
  temporaryEmployees
}) => {
  // Convert string values to numbers
  const permanentCount = typeof permanentEmployees === 'string' ? parseInt(permanentEmployees, 10) || 0 : permanentEmployees;
  const temporaryCount = typeof temporaryEmployees === 'string' ? parseInt(temporaryEmployees, 10) || 0 : temporaryEmployees;
  
  const hasData = permanentCount > 0 || temporaryCount > 0;
  const totalEmployees = permanentCount + temporaryCount;
  
  // Format data for employment type
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasData ? 'pie' : 'empty';
  
  if (hasData) {
    chartData = [
      { name: 'Indeterminato', value: permanentCount },
      { name: 'Determinato', value: temporaryCount }
    ].filter(item => item.value > 0);
  }
  
  // Colors for the chart
  const colors = ['#38A169', '#F56565'];
  
  // Custom tooltip formatter
  const employmentTooltipFormatter = (value: number, name: string) => {
    const percentage = ((value / totalEmployees) * 100).toFixed(1);
    const isIndeterminato = name === 'Indeterminato';
    
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">{value} dipendenti a {name}</p>
        <p className="text-xs text-gray-500">
          {percentage}% del totale dei dipendenti
        </p>
        <div className="flex items-center text-xs text-green-600 gap-1 mt-1">
          <Info size={12} />
          <span>
            {isIndeterminato 
              ? 'Contratto a tempo indeterminato' 
              : 'Contratto a tempo determinato'}
          </span>
        </div>
      </div>
    );
  };
  
  console.log("Employment chart data:", { hasData, chartData, permanentCount, temporaryCount, totalEmployees });
  
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
          tooltipFormatter={employmentTooltipFormatter}
        />
      </div>
    </div>
  );
};

export default EmploymentTypeChart;
