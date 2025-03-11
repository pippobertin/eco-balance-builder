
import React from 'react';
import { ReportData } from '@/context/types';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GenderDistributionChart from './social/GenderDistributionChart';
import ContractTypeChart from './social/ContractTypeChart';
import EmploymentTypeChart from './social/EmploymentTypeChart';
import TrainingChart from './social/TrainingChart';
import SafetyChart from './social/SafetyChart';

interface SocialSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const SocialSection: React.FC<SocialSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const {
    totalEmployees,
    maleEmployees,
    femaleEmployees,
    otherGenderEmployees,
    permanentEmployees,
    temporaryEmployees,
    fullTimeEmployees,
    partTimeEmployees,
    avgTrainingHoursMale,
    avgTrainingHoursFemale,
    employeeTurnover,
    workAccidents
  } = reportData.socialMetrics || {};
  
  const handleSectionClick = () => {
    navigate('/report', { state: { activeTab: 'metrics', section: 'social' } });
  };
  
  return (
    <div 
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all"
      onClick={handleSectionClick}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Performance Sociale
          {companyName && <span className="text-blue-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Individual chart components */}
        <GenderDistributionChart 
          maleEmployees={maleEmployees}
          femaleEmployees={femaleEmployees}
          otherGenderEmployees={otherGenderEmployees}
        />
        
        <ContractTypeChart
          permanentEmployees={permanentEmployees}
          temporaryEmployees={temporaryEmployees}
        />
        
        <EmploymentTypeChart
          fullTimeEmployees={fullTimeEmployees}
          partTimeEmployees={partTimeEmployees}
        />
        
        <TrainingChart
          avgTrainingHoursMale={avgTrainingHoursMale}
          avgTrainingHoursFemale={avgTrainingHoursFemale}
        />
        
        <SafetyChart
          employeeTurnover={employeeTurnover}
          workAccidents={workAccidents}
        />
      </div>
    </div>
  );
};

export default SocialSection;
