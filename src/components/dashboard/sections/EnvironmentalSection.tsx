
import React from 'react';
import { ReportData } from '@/context/types';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmissionsChart from './environmental/EmissionsChart';
import EnergyConsumptionChart from './environmental/EnergyConsumptionChart';
import ResourceUsageChart from './environmental/ResourceUsageChart';

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
    carbonEmissions,
    energyConsumption,
    wasteGeneration,
    waterUsage,
    renewableEnergy
  } = reportData.environmentalMetrics || {};
  
  const handleSectionClick = () => {
    navigate('/report', { state: { activeTab: 'metrics', section: 'environmental' } });
  };
  
  return (
    <div 
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
      onClick={handleSectionClick}
    >
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="h-6 w-6 text-green-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Performance Ambientale
          {companyName && <span className="text-green-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onClick={(e) => e.stopPropagation()}>
        <EmissionsChart 
          totalScope1Emissions={totalScope1Emissions}
          totalScope2Emissions={totalScope2Emissions}
          totalScope3Emissions={totalScope3Emissions}
        />
        
        <EnergyConsumptionChart
          energyConsumption={energyConsumption}
          renewableEnergy={renewableEnergy}
        />
        
        <ResourceUsageChart
          waterUsage={waterUsage}
          wasteGeneration={wasteGeneration}
        />
      </div>
    </div>
  );
};

export default EnvironmentalSection;
