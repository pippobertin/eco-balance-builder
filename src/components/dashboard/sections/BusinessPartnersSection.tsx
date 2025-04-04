
import React from 'react';
import { ReportData } from '@/context/types';
import { Building2 } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';

interface BusinessPartnersSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const BusinessPartnersSection: React.FC<BusinessPartnersSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  // Extract data from the new BP tables format with safe type checking
  const bp1 = reportData.businessPartnersMetrics?.bp1 || {};
  const bp2 = reportData.businessPartnersMetrics?.bp2 || {};
  const bp3 = reportData.businessPartnersMetrics?.bp3 || {};
  const bp6 = reportData.businessPartnersMetrics?.bp6 || {};
  const bp10 = reportData.businessPartnersMetrics?.bp10 || {};
  const bp11 = reportData.businessPartnersMetrics?.bp11 || {};

  // BP1 data for chart
  const sectorData = [];
  
  if (bp1 && 'controversialWeapons' in bp1 && bp1.controversialWeapons && 
      'controversialWeaponsRevenue' in bp1 && typeof bp1.controversialWeaponsRevenue === 'number') {
    sectorData.push({ name: 'Armi controverse', value: bp1.controversialWeaponsRevenue });
  }
  
  if (bp1 && 'tobacco' in bp1 && bp1.tobacco && 
      'tobaccoRevenue' in bp1 && typeof bp1.tobaccoRevenue === 'number') {
    sectorData.push({ name: 'Tabacco', value: bp1.tobaccoRevenue });
  }
  
  if (bp1 && 'fossilFuels' in bp1 && bp1.fossilFuels) {
    const coalRevenue = 'coalRevenue' in bp1 && typeof bp1.coalRevenue === 'number' ? bp1.coalRevenue : 0;
    const oilRevenue = 'oilRevenue' in bp1 && typeof bp1.oilRevenue === 'number' ? bp1.oilRevenue : 0;
    const gasRevenue = 'gasRevenue' in bp1 && typeof bp1.gasRevenue === 'number' ? bp1.gasRevenue : 0;
    
    const fossilFuelsTotal = coalRevenue + oilRevenue + gasRevenue;
    if (fossilFuelsTotal > 0) {
      sectorData.push({ name: 'Combustibili fossili', value: fossilFuelsTotal });
    }
  }
  
  if (bp1 && 'chemicals' in bp1 && bp1.chemicals && 
      'chemicalsRevenue' in bp1 && typeof bp1.chemicalsRevenue === 'number') {
    sectorData.push({ name: 'Sostanze chimiche', value: bp1.chemicalsRevenue });
  }
  
  // BP2 gender diversity data
  const genderData = [];
  const maleMembers = bp2 && 'maleGovernanceMembers' in bp2 && typeof bp2.maleGovernanceMembers === 'number' ? bp2.maleGovernanceMembers : 0;
  const femaleMembers = bp2 && 'femaleGovernanceMembers' in bp2 && typeof bp2.femaleGovernanceMembers === 'number' ? bp2.femaleGovernanceMembers : 0;
  const otherMembers = bp2 && 'otherGenderGovernanceMembers' in bp2 && typeof bp2.otherGenderGovernanceMembers === 'number' ? bp2.otherGenderGovernanceMembers : 0;
  
  if (maleMembers > 0) {
    genderData.push({ name: 'Uomini', value: maleMembers });
  }
  
  if (femaleMembers > 0) {
    genderData.push({ name: 'Donne', value: femaleMembers });
  }
  
  if (otherMembers > 0) {
    genderData.push({ name: 'Altri generi', value: otherMembers });
  }
  
  // BP3 ghg reduction targets
  const emissionsData = [];
  if (bp3 && 'hasGhgReductionTargets' in bp3 && bp3.hasGhgReductionTargets) {
    if ('ghgReductionTargetScope1' in bp3 && typeof bp3.ghgReductionTargetScope1 === 'number') {
      emissionsData.push({ name: 'Ambito 1', value: bp3.ghgReductionTargetScope1 });
    }
    
    if ('ghgReductionTargetScope2' in bp3 && typeof bp3.ghgReductionTargetScope2 === 'number') {
      emissionsData.push({ name: 'Ambito 2', value: bp3.ghgReductionTargetScope2 });
    }
    
    if ('ghgReductionTargetScope3' in bp3 && typeof bp3.ghgReductionTargetScope3 === 'number') {
      emissionsData.push({ name: 'Ambito 3', value: bp3.ghgReductionTargetScope3 });
    }
  }
  
  // BP6 hazardous waste
  const wasteData = [];
  if (bp6 && 'hasHazardousWaste' in bp6 && bp6.hasHazardousWaste) {
    if ('hazardousWasteTotal' in bp6 && typeof bp6.hazardousWasteTotal === 'number') {
      wasteData.push({ name: 'Rifiuti pericolosi', value: bp6.hazardousWasteTotal });
    }
    
    if ('radioactiveWasteTotal' in bp6 && typeof bp6.radioactiveWasteTotal === 'number') {
      wasteData.push({ name: 'Rifiuti radioattivi', value: bp6.radioactiveWasteTotal });
    }
  }
  
  // BP10-11 Work-life balance and apprentices
  const workLifeData = [];
  if (bp10 && 
      ('maleFamilyLeaveEligible' in bp10 && typeof bp10.maleFamilyLeaveEligible === 'number' || 
       'femaleFamilyLeaveEligible' in bp10 && typeof bp10.femaleFamilyLeaveEligible === 'number')) {
    workLifeData.push({ 
      name: 'Congedo familiare',
      male: 'maleFamilyLeaveUsed' in bp10 && typeof bp10.maleFamilyLeaveUsed === 'number' ? bp10.maleFamilyLeaveUsed : 0,
      female: 'femaleFamilyLeaveUsed' in bp10 && typeof bp10.femaleFamilyLeaveUsed === 'number' ? bp10.femaleFamilyLeaveUsed : 0
    });
  }
  
  const apprenticesData = [];
  if (bp11 && 'hasApprentices' in bp11 && bp11.hasApprentices && 
      'apprenticesNumber' in bp11 && typeof bp11.apprenticesNumber === 'number') {
    apprenticesData.push({ name: 'Apprendisti', value: bp11.apprenticesNumber });
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-6 w-6 text-orange-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Partner Commerciali
          {companyName && <span className="text-orange-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricChart
          title="BP1 - Ricavi in settori specifici"
          description="Distribuzione dei ricavi per settore"
          type={sectorData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: sectorData, colors: ['#0EA5E9', '#F97316', '#DC2626', '#84CC16'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp1' } })}
        />
        
        <MetricChart
          title="BP2 - Diversità di genere nella governance"
          description="Composizione per genere degli organi di governance"
          type={genderData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: genderData, colors: ['#3B82F6', '#EC4899', '#A855F7'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp2' } })}
        />
        
        <MetricChart
          title="BP3 - Obiettivi riduzione emissioni GHG"
          description="Obiettivi di riduzione per ambito (%)"
          type={emissionsData.length > 0 ? "bar" : "empty"}
          data={emissionsData}
          dataKey="name"
          categories={["value"]}
          colors={['#10B981']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp3' } })}
        />
        
        <MetricChart
          title="BP6 - Rifiuti pericolosi/radioattivi"
          description="Quantità di rifiuti pericolosi e radioattivi"
          type={wasteData.length > 0 ? "bar" : "empty"}
          data={wasteData}
          dataKey="name"
          categories={["value"]}
          colors={['#F59E0B']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp6' } })}
        />

        <MetricChart
          title="BP10 - Equilibrio lavoro-vita privata"
          description="Utilizzo congedo familiare per genere"
          type={workLifeData.length > 0 ? "bar" : "empty"}
          data={workLifeData}
          dataKey="name"
          categories={["male", "female"]}
          colors={['#3B82F6', '#EC4899']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp10' } })}
        />
        
        <MetricChart
          title="BP11 - Apprendisti"
          description="Numero di apprendisti"
          type={apprenticesData.length > 0 ? "bar" : "empty"}
          data={apprenticesData}
          dataKey="name"
          categories={["value"]}
          colors={['#8B5CF6']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'business-partners', field: 'bp11' } })}
        />
      </div>
    </div>
  );
};

export default BusinessPartnersSection;
