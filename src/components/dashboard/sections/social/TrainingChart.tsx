
import React from 'react';
import MetricChart from '@/components/dashboard/MetricChart';

interface TrainingChartProps {
  avgTrainingHoursMale?: number;
  avgTrainingHoursFemale?: number;
}

const TrainingChart: React.FC<TrainingChartProps> = ({
  avgTrainingHoursMale,
  avgTrainingHoursFemale
}) => {
  // Prepare data for training chart
  const trainingData = [];
  
  if (avgTrainingHoursMale || avgTrainingHoursFemale) {
    if (avgTrainingHoursMale) {
      trainingData.push({
        name: 'Uomini',
        value: typeof avgTrainingHoursMale === 'number' ? avgTrainingHoursMale : 
               typeof avgTrainingHoursMale === 'string' ? parseFloat(avgTrainingHoursMale) || 0 : 0
      });
    }
    
    if (avgTrainingHoursFemale) {
      trainingData.push({
        name: 'Donne',
        value: typeof avgTrainingHoursFemale === 'number' ? avgTrainingHoursFemale : 
               typeof avgTrainingHoursFemale === 'string' ? parseFloat(avgTrainingHoursFemale) || 0 : 0
      });
    }
  }

  return (
    <MetricChart
      title="Formazione"
      description="Ore medie di formazione per genere"
      type={trainingData.length > 0 ? "bar" : "empty"}
      data={trainingData}
      dataKey="name"
      categories={["value"]}
      colors={["#0EA5E9", "#FFDEE2"]} 
      // Azzurro per uomini, Rosa per donne
    />
  );
};

export default TrainingChart;
