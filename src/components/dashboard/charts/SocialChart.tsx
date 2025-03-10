
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
  
  // Convert string values to numbers for checking
  const maleCount = typeof maleEmployees === 'string' ? parseInt(maleEmployees, 10) || 0 : maleEmployees;
  const femaleCount = typeof femaleEmployees === 'string' ? parseInt(femaleEmployees, 10) || 0 : femaleEmployees;
  const otherCount = typeof otherGenderEmployees === 'string' ? parseInt(otherGenderEmployees, 10) || 0 : otherGenderEmployees;
  const permanentCount = typeof permanentEmployees === 'string' ? parseInt(permanentEmployees, 10) || 0 : permanentEmployees;
  const tempCount = typeof temporaryEmployees === 'string' ? parseInt(temporaryEmployees, 10) || 0 : temporaryEmployees;
  const maleTrain = typeof avgTrainingHoursMale === 'string' ? parseFloat(avgTrainingHoursMale) || 0 : avgTrainingHoursMale;
  const femaleTrain = typeof avgTrainingHoursFemale === 'string' ? parseFloat(avgTrainingHoursFemale) || 0 : avgTrainingHoursFemale;
  
  // Check if we have detailed data
  const hasGenderData = maleCount > 0 || femaleCount > 0 || otherCount > 0;
  const hasEmploymentTypeData = permanentCount > 0 || tempCount > 0;
  const hasTrainingData = maleTrain > 0 || femaleTrain > 0;
  
  // Determine whether to show multiple charts or a single chart
  const showMultipleCharts = hasGenderData || hasEmploymentTypeData || hasTrainingData;
  
  console.log("Social Chart Data:", { 
    hasGenderData, 
    hasEmploymentTypeData, 
    hasTrainingData, 
    showMultipleCharts,
    maleEmployees,
    femaleEmployees,
    otherGenderEmployees,
    permanentEmployees,
    temporaryEmployees,
    avgTrainingHoursMale,
    avgTrainingHoursFemale
  });
  
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
