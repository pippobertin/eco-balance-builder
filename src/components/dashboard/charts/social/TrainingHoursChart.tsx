
import React from 'react';
import { GraduationCap, Info } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

// Define the chart type using the correct type
type ChartType = 'area' | 'bar' | 'pie' | 'empty';

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
  // Explicitly type chartType
  const chartType: ChartType = hasData ? "bar" : "empty";
  
  if (hasData) {
    chartData = [
      { name: 'Uomini', value: avgTrainingHoursMale },
      { name: 'Donne', value: avgTrainingHoursFemale }
    ].filter(item => item.value > 0);
  }
  
  // Colors for the chart
  const colors = ['#4299E1', '#F56565'];
  
  // Custom tooltip formatter
  const trainingTooltipFormatter = (value: number, name: string) => {
    const difference = avgTrainingHoursMale - avgTrainingHoursFemale;
    const comparisonText = name === 'Uomini' 
      ? (difference > 0 
          ? `${Math.abs(difference).toFixed(1)} ore in più rispetto alle donne` 
          : `${Math.abs(difference).toFixed(1)} ore in meno rispetto alle donne`)
      : (difference < 0 
          ? `${Math.abs(difference).toFixed(1)} ore in più rispetto agli uomini` 
          : `${Math.abs(difference).toFixed(1)} ore in meno rispetto agli uomini`);
          
    return (
      <div className="space-y-1">
        <p className="text-sm font-medium">{value.toFixed(1)} ore medie annuali</p>
        <p className="text-xs text-gray-500">Per dipendente ({name})</p>
        {difference !== 0 && (
          <p className="text-xs text-gray-500">{comparisonText}</p>
        )}
        <div className="flex items-center text-xs text-orange-600 gap-1 mt-1">
          <Info size={12} />
          <span>Ore di formazione professionale</span>
        </div>
      </div>
    );
  };
  
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
          tooltipFormatter={trainingTooltipFormatter}
        />
      </div>
    </div>
  );
};

export default TrainingHoursChart;
