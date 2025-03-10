
import React from 'react';
import { GraduationCap } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

interface TrainingHoursChartProps {
  avgTrainingHoursMale: number;
  avgTrainingHoursFemale: number;
}

const TrainingHoursChart: React.FC<TrainingHoursChartProps> = ({
  avgTrainingHoursMale,
  avgTrainingHoursFemale
}) => {
  const hasData = avgTrainingHoursMale > 0 || avgTrainingHoursFemale > 0;
  
  // Format data for training hours
  let chartData = [];
  let chartType = hasData ? "bar" : "empty";
  
  if (hasData) {
    chartData = [
      { name: 'Uomini', value: avgTrainingHoursMale },
      { name: 'Donne', value: avgTrainingHoursFemale }
    ].filter(item => item.value > 0);
  }
  
  // Colors for the chart
  const colors = ['#4299E1', '#F56565'];
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-orange-500" />
        <h4 className="text-sm font-medium">Ore di Formazione Media per Dipendente</h4>
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

export default TrainingHoursChart;
