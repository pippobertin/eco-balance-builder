
import React from 'react';
import { Users, Info } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

// Define the chart type using the correct type
type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface GenderDistributionChartProps {
  maleEmployees: number;
  femaleEmployees: number;
  otherGenderEmployees: number;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  maleEmployees,
  femaleEmployees,
  otherGenderEmployees
}) => {
  const hasData = maleEmployees > 0 || femaleEmployees > 0 || otherGenderEmployees > 0;
  const totalEmployees = maleEmployees + femaleEmployees + otherGenderEmployees;
  
  // Format data for gender distribution
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasData ? "pie" : "empty";
  
  if (hasData) {
    // If we have gender data, create a pie chart
    chartData = [
      { name: 'Uomini', value: maleEmployees },
      { name: 'Donne', value: femaleEmployees },
      { name: 'Altri', value: otherGenderEmployees }
    ].filter(item => item.value > 0);
  }
  
  // Colors for the chart
  const colors = ['#4299E1', '#F56565', '#ECC94B'];
  
  // Custom tooltip formatter
  const genderTooltipFormatter = (value: number, name: string) => {
    const percentage = ((value / totalEmployees) * 100).toFixed(1);
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">{value} {name}</p>
        <p className="text-xs text-gray-500">
          {percentage}% del totale dei dipendenti
        </p>
        <div className="flex items-center text-xs text-blue-600 gap-1 mt-1">
          <Info size={12} />
          <span>Rappresentazione di genere</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-500" />
        <h4 className="text-sm font-medium">Distribuzione per Genere</h4>
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
          tooltipFormatter={genderTooltipFormatter}
        />
      </div>
    </div>
  );
};

export default GenderDistributionChart;
