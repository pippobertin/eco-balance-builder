
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
    totalScope3Emissions,
    energyConsumption,
    renewableEnergy,
    waterUsage,
    wasteGeneration
  } = reportData.environmentalMetrics || {};

  // B3: Emissions data
  const emissionsData = [];
  const totalEmissions = (totalScope1Emissions || 0) + (totalScope2Emissions || 0) + (totalScope3Emissions || 0);
  
  if (totalScope1Emissions) emissionsData.push({ name: 'Scope 1', value: totalScope1Emissions });
  if (totalScope2Emissions) emissionsData.push({ name: 'Scope 2', value: totalScope2Emissions });
  if (totalScope3Emissions) emissionsData.push({ name: 'Scope 3', value: totalScope3Emissions });

  // B4: Energy data
  const energyData = [];
  if (energyConsumption) energyData.push({ name: 'Totale', value: energyConsumption });
  if (renewableEnergy) energyData.push({ name: 'Rinnovabile', value: renewableEnergy });

  // B5-B6: Resource usage data
  const resourceData = [];
  if (waterUsage) resourceData.push({ name: 'Consumo Acqua', value: waterUsage });
  if (wasteGeneration) resourceData.push({ name: 'Produzione Rifiuti', value: wasteGeneration });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Performance Ambientale
          {companyName && <span className="text-green-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricChart
          title="Emissioni GHG (B3)"
          description="Emissioni di gas serra per scope"
          type={emissionsData.length > 0 ? "donut" : "empty"}
          data={[
            { ring: 'inner', data: emissionsData, colors: ['#D946EF', '#F97316', '#0EA5E9'] },
            { ring: 'outer', data: [{ name: 'Totale Emissioni', value: totalEmissions }], colors: ['#8B5CF6'] }
          ]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'emissions' } })}
        />
        
        <MetricChart
          title="Consumo Energetico (B4)"
          description="Consumo energetico e fonti rinnovabili"
          type={energyData.length > 0 ? "bar" : "empty"}
          data={energyData}
          dataKey="name"
          categories={["value"]}
          colors={['#F97316', '#34C759']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'energy' } })}
        />
        
        <MetricChart
          title="Risorse (B5-B6)"
          description="Utilizzo acqua e produzione rifiuti"
          type={resourceData.length > 0 ? "bar" : "empty"}
          data={resourceData}
          dataKey="name"
          categories={["value"]}
          colors={['#5AC8FA', '#FF9500']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'environmental', field: 'resources' } })}
        />
      </div>
    </div>
  );
};

export default EnvironmentalSection;
