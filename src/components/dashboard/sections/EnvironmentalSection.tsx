
import React from 'react';
import { ReportData, LocationEnvironmentalMetrics } from '@/context/types';
import { Leaf } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';
import EmissionsChart from './environmental/EmissionsChart';

interface EnvironmentalSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const getAggregatedMetrics = () => {
    const locationMetrics = reportData.environmentalMetrics?.locationMetrics || [];
    
    if (locationMetrics.length > 0) {
      const aggregated = {
        totalScope1Emissions: 0,
        totalScope2Emissions: 0,
        totalScope3Emissions: 0,
        totalScopeEmissions: 0,
        emissionCalculationLogs: reportData.environmentalMetrics?.emissionCalculationLogs,
        // Energy metrics removed as requested
        waterUsage: 0,
        waterConsumption: 0, 
        waterStressAreas: 0,
        landUse: 0,
        impermeableSurface: 0,
        natureSurfaceOnSite: 0,
        natureSurfaceOffSite: 0,
        airPollution: 0,
        waterPollution: 0,
        soilPollution: 0,
        totalWaste: 0,
        recycledWaste: 0,
        hazardousWaste: 0,
        recycledContent: 0,
        recyclableContent: 0
      };
      
      locationMetrics.forEach((loc: LocationEnvironmentalMetrics) => {
        const metrics = loc.metrics;
        
        Object.keys(metrics).forEach(key => {
          const value = Number(metrics[key]);
          if (!isNaN(value) && aggregated.hasOwnProperty(key)) {
            aggregated[key] += value;
          }
        });
      });
      
      return aggregated;
    } else {
      return reportData.environmentalMetrics;
    }
  };
  
  const {
    totalScope1Emissions,
    totalScope2Emissions,
    totalScopeEmissions,
    emissionCalculationLogs,
    // Energy metrics removed as requested
    waterUsage,
    waterConsumption,
    waterStressAreas,
    landUse,
    impermeableSurface,
    natureSurfaceOnSite,
    natureSurfaceOffSite,
    airPollution,
    waterPollution,
    soilPollution,
    totalWaste,
    recycledWaste,
    hazardousWaste,
    recycledContent,
    recyclableContent
  } = getAggregatedMetrics() || {};

  const pollutionData = [];
  if (airPollution) pollutionData.push({ name: 'Aria', value: airPollution });
  if (waterPollution) pollutionData.push({ name: 'Acqua', value: waterPollution });
  if (soilPollution) pollutionData.push({ name: 'Suolo', value: soilPollution });

  const biodiversityData = [];
  if (landUse) biodiversityData.push({ name: 'Uso Totale\nTerreno', value: landUse });
  if (impermeableSurface) biodiversityData.push({ name: 'Superficie\nImpermeabilizzata', value: impermeableSurface });
  if (natureSurfaceOnSite) biodiversityData.push({ name: 'Sup. Naturale\nIn Sito', value: natureSurfaceOnSite });
  if (natureSurfaceOffSite) biodiversityData.push({ name: 'Sup. Naturale\nFuori Sito', value: natureSurfaceOffSite });

  const waterData = [];
  if (waterUsage) waterData.push({ name: 'Prelievo\nIdrico', value: waterUsage });
  if (waterConsumption) waterData.push({ name: 'Consumo\nIdrico', value: waterConsumption });
  if (waterStressAreas) waterData.push({ name: 'Prelievo Aree\nStress Idrico', value: waterStressAreas });

  const wasteData = [];
  if (totalWaste) wasteData.push({ name: 'Totale\nRifiuti', value: totalWaste });
  if (recycledWaste) wasteData.push({ name: 'Rifiuti\nRiciclati', value: recycledWaste });
  if (hazardousWaste) wasteData.push({ name: 'Rifiuti\nPericolosi', value: hazardousWaste });

  const circularEconomyData = [];
  if (recycledContent) circularEconomyData.push({ name: 'Contenuto\nRiciclato', value: recycledContent });
  if (recyclableContent) circularEconomyData.push({ name: 'Contenuto\nRiciclabile', value: recyclableContent });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Metriche Ambientali
          {companyName && <span className="text-green-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EmissionsChart
          totalScope1Emissions={totalScope1Emissions}
          totalScope2Emissions={totalScope2Emissions}
          totalScope3Emissions={reportData.environmentalMetrics?.totalScope3Emissions}
          emissionCalculationLogs={emissionCalculationLogs}
        />
        
        {/* Energy chart removed as requested */}
        
        <MetricChart
          title="B4 - Inquinamento"
          description="Emissioni di inquinanti in aria, acqua e suolo"
          type={pollutionData.length > 0 ? "bar" : "empty"}
          data={pollutionData}
          dataKey="name"
          categories={["value"]}
          colors={['#5AC8FA', '#0EA5E9', '#8B5CF6']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'pollution' } })}
        />

        <MetricChart
          title="B5 - Biodiversità"
          description="Uso del suolo e superficie (ettari)"
          type={biodiversityData.length > 0 ? "bar" : "empty"}
          data={biodiversityData}
          dataKey="name"
          categories={["value"]}
          colors={['#FF9500', '#FF3B30', '#34C759', '#30D158']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'biodiversity' } })}
        />
        
        <MetricChart
          title="B6 - Acqua"
          description="Prelievo e consumo idrico"
          type={waterData.length > 0 ? "bar" : "empty"}
          data={waterData}
          dataKey="name"
          categories={["value"]}
          colors={['#5AC8FA', '#0EA5E9', '#0C6CF2']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'water' } })}
        />

        <MetricChart
          title="B7 - Rifiuti ed Economia Circolare"
          description="Gestione rifiuti e contenuto riciclato/riciclabile"
          type={(wasteData.length > 0 || circularEconomyData.length > 0) ? "bar" : "empty"}
          data={[...wasteData, ...circularEconomyData]}
          dataKey="name"
          categories={["value"]}
          colors={['#FF9500', '#34C759', '#FF3B30', '#34C759', '#5AC8FA']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'waste' } })}
        />
      </div>
    </div>
  );
};

export default EnvironmentalSection;
