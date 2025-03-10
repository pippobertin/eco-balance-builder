
import React from 'react';
import { Users, Info } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

type ChartType = 'area' | 'bar' | 'pie' | 'empty';

interface GenderDistributionChartProps {
  maleEmployees: number | string;
  femaleEmployees: number | string;
  otherGenderEmployees: number | string;
}

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  maleEmployees,
  femaleEmployees,
  otherGenderEmployees
}) => {
  // Convert string values to numbers
  const maleCount = typeof maleEmployees === 'string' ? parseInt(maleEmployees, 10) || 0 : maleEmployees;
  const femaleCount = typeof femaleEmployees === 'string' ? parseInt(femaleEmployees, 10) || 0 : femaleEmployees;
  const otherCount = typeof otherGenderEmployees === 'string' ? parseInt(otherGenderEmployees, 10) || 0 : otherGenderEmployees;
  
  const hasData = maleCount > 0 || femaleCount > 0 || otherCount > 0;
  const totalEmployees = maleCount + femaleCount + otherCount;
  
  // Format data for gender distribution
  let chartData = [];
  // Explicitly type chartType
  const chartType: ChartType = hasData ? 'pie' : 'empty';
  
  if (hasData) {
    // If we have gender data, create a pie chart
    chartData = [
      { name: 'Uomini', value: maleCount },
      { name: 'Donne', value: femaleCount },
      { name: 'Altri', value: otherCount }
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
  
  console.log("Gender chart data:", { hasData, chartData, maleCount, femaleCount, otherCount, totalEmployees });
  
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
