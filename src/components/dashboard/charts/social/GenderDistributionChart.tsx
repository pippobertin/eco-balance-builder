
import React from 'react';
import { Users } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

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
  
  // Format data for gender distribution
  let chartData = [];
  let chartType = hasData ? "pie" : "empty";
  
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
        />
      </div>
    </div>
  );
};

export default GenderDistributionChart;
