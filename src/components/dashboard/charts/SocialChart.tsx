
import React from 'react';
import { ReportData } from '@/context/types';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';
import GenderDistributionChart from './social/GenderDistributionChart';
import EmploymentTypeChart from './social/EmploymentTypeChart';
import TrainingHoursChart from './social/TrainingHoursChart';
import LegacySocialMetricsChart from './social/LegacySocialMetricsChart';

interface SocialChartProps {
  reportData: ReportData;
}

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Extract data from reportData
  const totalEmployees = reportData.socialMetrics?.totalEmployees || 0;
  const maleEmployees = reportData.socialMetrics?.maleEmployees || 0;
  const femaleEmployees = reportData.socialMetrics?.femaleEmployees || 0;
  const otherGenderEmployees = reportData.socialMetrics?.otherGenderEmployees || 0;
  const permanentEmployees = reportData.socialMetrics?.permanentEmployees || 0;
  const temporaryEmployees = reportData.socialMetrics?.temporaryEmployees || 0;
  const avgTrainingHoursMale = reportData.socialMetrics?.avgTrainingHoursMale || 0;
  const avgTrainingHoursFemale = reportData.socialMetrics?.avgTrainingHoursFemale || 0;
  
  // Check if we have detailed data
  const hasGenderData = totalEmployees > 0 && (maleEmployees > 0 || femaleEmployees > 0 || otherGenderEmployees > 0);
  const hasEmploymentTypeData = totalEmployees > 0 && (permanentEmployees > 0 || temporaryEmployees > 0);
  const hasTrainingData = avgTrainingHoursMale > 0 || avgTrainingHoursFemale > 0;
  
  // Determine whether to show multiple charts or a single chart
  const showMultipleCharts = hasGenderData || hasEmploymentTypeData || hasTrainingData;
  
  if (showMultipleCharts) {
    return (
      <GlassmorphicCard
        className="w-full"
        hover={false}
        header={
          <div className="space-y-1.5">
            <h3 className="text-lg font-medium text-gray-900">Diversità del Personale</h3>
            <p className="text-sm text-gray-500">
              {totalEmployees > 0 ? `${totalEmployees} dipendenti totali` : "Dati del personale"}
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-6 pt-4">
          {hasGenderData && (
            <GenderDistributionChart 
              maleEmployees={maleEmployees}
              femaleEmployees={femaleEmployees}
              otherGenderEmployees={otherGenderEmployees}
            />
          )}
          
          {hasEmploymentTypeData && (
            <EmploymentTypeChart
              permanentEmployees={permanentEmployees}
              temporaryEmployees={temporaryEmployees}
            />
          )}
          
          {hasTrainingData && (
            <TrainingHoursChart
              avgTrainingHoursMale={avgTrainingHoursMale}
              avgTrainingHoursFemale={avgTrainingHoursFemale}
            />
          )}
        </div>
      </GlassmorphicCard>
    );
  } else {
    // Fallback to legacy data or empty chart
    return <LegacySocialMetricsChart reportData={reportData} />;
  }
};

export default SocialChart;
