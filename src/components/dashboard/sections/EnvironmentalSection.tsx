
import React from 'react';
import { ReportData } from '@/context/types';
import { Leaf } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';

interface EnvironmentalSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const EnvironmentalSection: React.FC<EnvironmentalSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const {
    totalScope1Emissions,
    totalScope2Emissions,
    totalScopeEmissions,
    energyConsumption,
    renewableEnergy,
    fossilFuelEnergy,
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
  } = reportData.environmentalMetrics || {};

  // B3: GHG Emissions
  const emissionsData = [];
  if (totalScope1Emissions) emissionsData.push({ name: 'Scope 1', value: totalScope1Emissions });
  if (totalScope2Emissions) emissionsData.push({ name: 'Scope 2', value: totalScope2Emissions });
  
  // B3: Energy
  const energyData = [];
  if (fossilFuelEnergy) energyData.push({ name: 'Combustibili\nFossili', value: fossilFuelEnergy });
  if (renewableEnergy) energyData.push({ name: 'Rinnovabile', value: renewableEnergy });
  if (energyConsumption && (energyConsumption > (fossilFuelEnergy || 0) + (renewableEnergy || 0))) {
    const otherEnergy = energyConsumption - (fossilFuelEnergy || 0) - (renewableEnergy || 0);
    energyData.push({ name: 'Altro', value: otherEnergy });
  }

  // B4: Pollution
  const pollutionData = [];
  if (airPollution) pollutionData.push({ name: 'Aria', value: airPollution });
  if (waterPollution) pollutionData.push({ name: 'Acqua', value: waterPollution });
  if (soilPollution) pollutionData.push({ name: 'Suolo', value: soilPollution });

  // B5: Biodiversity & Land Use
  const biodiversityData = [];
  if (landUse) biodiversityData.push({ name: 'Uso Totale\nTerreno', value: landUse });
  if (impermeableSurface) biodiversityData.push({ name: 'Superficie\nImpermeabilizzata', value: impermeableSurface });
  if (natureSurfaceOnSite) biodiversityData.push({ name: 'Sup. Naturale\nIn Sito', value: natureSurfaceOnSite });
  if (natureSurfaceOffSite) biodiversityData.push({ name: 'Sup. Naturale\nFuori Sito', value: natureSurfaceOffSite });

  // B6: Water
  const waterData = [];
  if (waterUsage) waterData.push({ name: 'Prelievo\nIdrico', value: waterUsage });
  if (waterConsumption) waterData.push({ name: 'Consumo\nIdrico', value: waterConsumption });
  if (waterStressAreas) waterData.push({ name: 'Prelievo Aree\nStress Idrico', value: waterStressAreas });

  // B7: Resources & Waste
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
        <MetricChart
          title="B3 - Emissioni GHG"
          description="Emissioni di gas serra (tCO2eq)"
          type={emissionsData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: emissionsData, colors: ['#34C759', '#F97316'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'emissions' } })}
        />
        
        <MetricChart
          title="B3 - Energia"
          description="Consumo energetico (MWh)"
          type={energyData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: energyData, colors: ['#F97316', '#34C759', '#8B5CF6'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'energy' } })}
        />
        
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
