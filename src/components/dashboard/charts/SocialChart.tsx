
import React from 'react';
import { Users, Briefcase, GraduationCap } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { ReportData } from '@/context/types';
import GlassmorphicCard from '@/components/ui/GlassmorphicCard';

interface SocialChartProps {
  reportData: ReportData;
}

// Define ChartType to match the one in MetricChart
type ChartType = 'area' | 'bar' | 'pie' | 'empty';

const SocialChart: React.FC<SocialChartProps> = ({ reportData }) => {
  // Check if we have gender data
  const totalEmployees = reportData.socialMetrics?.totalEmployees || 0;
  const maleEmployees = reportData.socialMetrics?.maleEmployees || 0;
  const femaleEmployees = reportData.socialMetrics?.femaleEmployees || 0;
  const otherGenderEmployees = reportData.socialMetrics?.otherGenderEmployees || 0;
  const permanentEmployees = reportData.socialMetrics?.permanentEmployees || 0;
  const temporaryEmployees = reportData.socialMetrics?.temporaryEmployees || 0;
  const avgTrainingHoursMale = reportData.socialMetrics?.avgTrainingHoursMale || 0;
  const avgTrainingHoursFemale = reportData.socialMetrics?.avgTrainingHoursFemale || 0;
  
  const hasGenderData = totalEmployees > 0 && (maleEmployees > 0 || femaleEmployees > 0 || otherGenderEmployees > 0);
  const hasEmploymentTypeData = totalEmployees > 0 && (permanentEmployees > 0 || temporaryEmployees > 0);
  const hasTrainingData = avgTrainingHoursMale > 0 || avgTrainingHoursFemale > 0;
  
  // Format data for gender distribution
  let genderChartData = [];
  let genderChartType: ChartType = "empty";
  
  if (hasGenderData) {
    // If we have gender data, create a pie chart
    genderChartData = [
      { name: 'Uomini', value: maleEmployees },
      { name: 'Donne', value: femaleEmployees },
      { name: 'Altri', value: otherGenderEmployees }
    ].filter(item => item.value > 0);
    
    genderChartType = "pie";
  }
  
  // Format data for employment type
  let employmentChartData = [];
  let employmentChartType: ChartType = "empty";
  
  if (hasEmploymentTypeData) {
    employmentChartData = [
      { name: 'Indeterminato', value: permanentEmployees },
      { name: 'Determinato', value: temporaryEmployees }
    ].filter(item => item.value > 0);
    
    employmentChartType = "pie";
  }
  
  // Format data for training hours
  let trainingChartData = [];
  let trainingChartType: ChartType = "empty";
  
  if (hasTrainingData) {
    trainingChartData = [
      { name: 'Uomini', value: avgTrainingHoursMale },
      { name: 'Donne', value: avgTrainingHoursFemale }
    ].filter(item => item.value > 0);
    
    trainingChartType = "bar";
  }
  
  // Colors for the charts
  const genderColors = ['#4299E1', '#F56565', '#ECC94B'];
  const employmentColors = ['#38A169', '#F56565'];
  const trainingColors = ['#4299E1', '#F56565'];
  
  // If we don't have any data, check if we have legacy social metrics
  const hasLegacySocialData = 
    reportData.socialMetrics && 
    ((typeof reportData.socialMetrics.employeeDiversity === 'number' && reportData.socialMetrics.employeeDiversity > 0) || 
     (typeof reportData.socialMetrics.employeeSatisfaction === 'number' && reportData.socialMetrics.employeeSatisfaction > 0) || 
     (typeof reportData.socialMetrics.trainingHours === 'number' && reportData.socialMetrics.trainingHours > 0) || 
     (typeof reportData.socialMetrics.communityEngagement === 'number' && reportData.socialMetrics.communityEngagement > 0));
  
  // If we don't have any detailed data, use legacy data
  let legacyChartData = [];
  let legacyChartType: ChartType = "empty";
  
  if (!hasGenderData && !hasEmploymentTypeData && !hasTrainingData && hasLegacySocialData) {
    legacyChartData = [
      { 
        name: 'Diversità di Genere', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeDiversity === 'number' 
          ? reportData.socialMetrics.employeeDiversity 
          : 0 
      },
      { 
        name: 'Soddisfazione Dipendenti', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.employeeSatisfaction === 'number'
          ? reportData.socialMetrics.employeeSatisfaction 
          : 0 
      },
      { 
        name: 'Ore di Formazione', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.trainingHours === 'number'
          ? reportData.socialMetrics.trainingHours 
          : 0 
      },
      { 
        name: 'Impegno Comunitario', 
        value: reportData.socialMetrics && typeof reportData.socialMetrics.communityEngagement === 'number'
          ? reportData.socialMetrics.communityEngagement 
          : 0
      }
    ];
    
    legacyChartType = "bar";
  }
  
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-medium">Distribuzione per Genere</h4>
              </div>
              <div className="h-[200px]">
                <MetricChart
                  title=""
                  type={genderChartType}
                  data={genderChartData}
                  dataKey="name"
                  categories={["value"]}
                  colors={genderColors}
                  height={200}
                />
              </div>
            </div>
          )}
          
          {hasEmploymentTypeData && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-green-500" />
                <h4 className="text-sm font-medium">Tipo di Contratto</h4>
              </div>
              <div className="h-[200px]">
                <MetricChart
                  title=""
                  type={employmentChartType}
                  data={employmentChartData}
                  dataKey="name"
                  categories={["value"]}
                  colors={employmentColors}
                  height={200}
                />
              </div>
            </div>
          )}
          
          {hasTrainingData && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-orange-500" />
                <h4 className="text-sm font-medium">Ore di Formazione Media per Dipendente</h4>
              </div>
              <div className="h-[200px]">
                <MetricChart
                  title=""
                  type={trainingChartType}
                  data={trainingChartData}
                  dataKey="name"
                  categories={["value"]}
                  colors={trainingColors}
                  height={200}
                />
              </div>
            </div>
          )}
        </div>
      </GlassmorphicCard>
    );
  } else {
    // Fallback to legacy data or empty chart
    return (
      <MetricChart
        title="Diversità del Personale"
        description={hasLegacySocialData ? 
          "Metriche sociali generali" : 
          "Nessun dato di diversità disponibile"}
        type={hasLegacySocialData ? legacyChartType : "empty"}
        data={legacyChartData}
        dataKey={hasLegacySocialData ? "name" : "name"}
        categories={hasLegacySocialData ? ['value'] : ['value']}
        colors={hasLegacySocialData ? ['#FF9500'] : ['#FF9500']}
        height={300}
      />
    );
  }
};

export default SocialChart;
