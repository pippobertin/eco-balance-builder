
import React from 'react';
import { ReportData } from '@/context/types';
import { Users } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';
import GenderDistributionChart from './social/GenderDistributionChart';
import ContractTypeChart from './social/ContractTypeChart';
import SafetyChart from './social/SafetyChart';
import TrainingChart from './social/TrainingChart';

interface SocialSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const SocialSection: React.FC<SocialSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const {
    maleEmployees,
    femaleEmployees,
    otherGenderEmployees,
    totalEmployees,
    permanentEmployees,
    temporaryEmployees,
    totalEmployeesFTE,
    workAccidentsNumber,
    workAccidentDeaths,
    workDiseaseDeaths,
    entryWage,
    localMinimumWage,
    entryWageToMinimumWageRatio,
    genderPayGap,
    collectiveBargainingCoverage,
    avgTrainingHoursMale,
    avgTrainingHoursFemale,
    employeesByCountry,
    supplyChainImpactProcess,
    identifiedImpacts,
    employeeTurnover,
    workAccidents
  } = reportData.socialMetrics || {};

  // B8: Workforce characteristics
  const hasTotalEmployees = !!totalEmployees || !!totalEmployeesFTE;
  const hasGenderBreakdown = !!maleEmployees || !!femaleEmployees || !!otherGenderEmployees;
  const hasContractTypes = !!permanentEmployees || !!temporaryEmployees;
  
  // B9: Workforce safety
  const safetyData = [];
  if (workAccidentsNumber) safetyData.push({ name: 'Infortuni\nRegistrabili', value: workAccidentsNumber });
  if (workAccidentDeaths) safetyData.push({ name: 'Decessi da\nInfortunio', value: workAccidentDeaths });
  if (workDiseaseDeaths) safetyData.push({ name: 'Decessi da\nMalattia Prof.', value: workDiseaseDeaths });
  
  // B10: Compensation and training
  const compensationData = [];
  if (entryWageToMinimumWageRatio) {
    compensationData.push({ 
      name: 'Rapporto Salario\nIngresso/Minimo', 
      value: entryWageToMinimumWageRatio 
    });
  } else if (entryWage && localMinimumWage && localMinimumWage > 0) {
    compensationData.push({ 
      name: 'Rapporto Salario\nIngresso/Minimo', 
      value: entryWage / localMinimumWage 
    });
  }
  
  if (genderPayGap) compensationData.push({ name: 'Divario\nRetributivo\ndi Genere (%)', value: genderPayGap });
  if (collectiveBargainingCoverage) compensationData.push({ name: 'Copertura\nContrattazione\nCollettiva (%)', value: collectiveBargainingCoverage });
  
  // B11: Supply chain impacts
  const supplyChainData = [];
  if (supplyChainImpactProcess === 'yes') {
    supplyChainData.push({ name: 'Processo di\nIdentificazione\nImpatti', value: 1 });
  }
  if (identifiedImpacts && identifiedImpacts.trim() !== '') {
    // This is a narrative field, so we just indicate it's present
    supplyChainData.push({ name: 'Impatti\nIdentificati', value: 1 });
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Metriche Sociali
          {companyName && <span className="text-blue-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* B8: Workforce Characteristics */}
        <MetricChart
          title="B8 - Totale Dipendenti"
          description="Numero totale dipendenti (persone o FTE)"
          type={hasTotalEmployees ? "bar" : "empty"}
          data={[
            { name: 'Totale\nDipendenti', value: totalEmployees || 0 },
            ...(totalEmployeesFTE ? [{ name: 'Dipendenti\nFTE', value: totalEmployeesFTE }] : [])
          ]}
          dataKey="name"
          categories={["value"]}
          colors={['#0EA5E9', '#5AC8FA']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'social', field: 'employeeInfo' } })}
        />
        
        <GenderDistributionChart
          maleEmployees={maleEmployees}
          femaleEmployees={femaleEmployees}
          otherGenderEmployees={otherGenderEmployees}
        />
        
        <ContractTypeChart
          permanentEmployees={permanentEmployees}
          temporaryEmployees={temporaryEmployees}
        />
        
        {/* B9: Workforce Safety */}
        <MetricChart
          title="B9 - Salute e Sicurezza"
          description="Infortuni e decessi sul lavoro"
          type={safetyData.length > 0 ? "bar" : "empty"}
          data={safetyData}
          dataKey="name"
          categories={["value"]}
          colors={['#FF9500', '#FF3B30', '#FF453A']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'social', field: 'safety' } })}
        />
        
        <SafetyChart
          employeeTurnover={employeeTurnover}
          workAccidents={workAccidents}
        />
        
        {/* B10: Compensation and Training */}
        <MetricChart
          title="B10 - Retribuzione e Contrattazione"
          description="Rapporti salariali e contrattazione collettiva"
          type={compensationData.length > 0 ? "bar" : "empty"}
          data={compensationData}
          dataKey="name"
          categories={["value"]}
          colors={['#34C759', '#FF3B30', '#007AFF']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'social', field: 'compensation' } })}
        />
        
        <TrainingChart
          avgTrainingHoursMale={avgTrainingHoursMale}
          avgTrainingHoursFemale={avgTrainingHoursFemale}
        />
        
        {/* B11: Supply Chain Impacts */}
        <MetricChart
          title="B11 - Impatti Catena del Valore"
          description="Processi di identificazione e gestione degli impatti"
          type={supplyChainData.length > 0 ? "bar" : "empty"}
          data={supplyChainData}
          dataKey="name"
          categories={["value"]}
          colors={['#007AFF', '#5856D6']}
          individualColors={true}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'social', field: 'supplyChain' } })}
        />
      </div>
    </div>
  );
};

export default SocialSection;
