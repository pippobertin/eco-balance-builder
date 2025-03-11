
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricChart from '@/components/dashboard/MetricChart';

interface TrainingChartProps {
  avgTrainingHoursMale?: number;
  avgTrainingHoursFemale?: number;
}

const TrainingChart: React.FC<TrainingChartProps> = ({
  avgTrainingHoursMale,
  avgTrainingHoursFemale
}) => {
  const navigate = useNavigate();
  
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
  
  const handleTitleClick = () => {
    navigate('/report', { state: { activeTab: 'metrics', section: 'social', field: 'training' } });
  };

  return (
    <MetricChart
      title="Formazione"
      description="Ore medie di formazione per genere"
      type={trainingData.length > 0 ? "bar" : "empty"}
      data={trainingData}
      dataKey="name"
      categories={["value"]}
      colors={["#0EA5E9", "#F472B6", "#9B87F5", "#FFA99F"]}
      individualColors={true}
      hideLegend={true}
      onTitleClick={handleTitleClick}
    />
  );
};

export default TrainingChart;
