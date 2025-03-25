
import React from 'react';
import { ReportData } from '@/context/types';
import { Building2 } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';
import { BP1FormData, BP2FormData, BP3FormData, BP6FormData, BP10FormData, BP11FormData } from '@/components/report/business-partners/hooks/types';

interface BusinessPartnersSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const BusinessPartnersSection: React.FC<BusinessPartnersSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  // Extract data from the business partners metrics and ensure proper typing
  const bp1 = reportData.businessPartnersMetrics?.bp1 as BP1FormData || {} as BP1FormData;
  const bp2 = reportData.businessPartnersMetrics?.bp2 as BP2FormData || {} as BP2FormData;
  const bp3 = reportData.businessPartnersMetrics?.bp3 as BP3FormData || {} as BP3FormData;
  const bp6 = reportData.businessPartnersMetrics?.bp6 as BP6FormData || {} as BP6FormData;
  const bp10 = reportData.businessPartnersMetrics?.bp10 as BP10FormData || {} as BP10FormData;
  const bp11 = reportData.businessPartnersMetrics?.bp11 as BP11FormData || {} as BP11FormData;

  // BP1 data for chart
  const sectorData = [];
  
  if (bp1.controversialWeapons && bp1.controversialWeaponsRevenue) {
    sectorData.push({ name: 'Armi controverse', value: bp1.controversialWeaponsRevenue });
  }
  
  if (bp1.tobacco && bp1.tobaccoRevenue) {
    sectorData.push({ name: 'Tabacco', value: bp1.tobaccoRevenue });
  }
  
  if (bp1.fossilFuels) {
    const fossilFuelsTotal = (bp1.coalRevenue || 0) + (bp1.oilRevenue || 0) + (bp1.gasRevenue || 0);
    if (fossilFuelsTotal > 0) {
      sectorData.push({ name: 'Combustibili fossili', value: fossilFuelsTotal });
    }
  }
  
  if (bp1.chemicals && bp1.chemicalsRevenue) {
    sectorData.push({ name: 'Sostanze chimiche', value: bp1.chemicalsRevenue });
  }
  
  // BP2 gender diversity data
  const genderData = [];
  const maleMembers = bp2.maleGovernanceMembers || 0;
  const femaleMembers = bp2.femaleGovernanceMembers || 0;
  const otherMembers = bp2.otherGenderGovernanceMembers || 0;
  
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
  if (bp3.hasGhgReductionTargets) {
    if (bp3.ghgReductionTargetScope1 !== undefined) {
      emissionsData.push({ name: 'Ambito 1', value: bp3.ghgReductionTargetScope1 });
    }
    
    if (bp3.ghgReductionTargetScope2 !== undefined) {
      emissionsData.push({ name: 'Ambito 2', value: bp3.ghgReductionTargetScope2 });
    }
    
    if (bp3.ghgReductionTargetScope3 !== undefined) {
      emissionsData.push({ name: 'Ambito 3', value: bp3.ghgReductionTargetScope3 });
    }
  }
  
  // BP6 hazardous waste
  const wasteData = [];
  if (bp6.hasHazardousWaste) {
    if (bp6.hazardousWasteTotal !== undefined) {
      wasteData.push({ name: 'Rifiuti pericolosi', value: bp6.hazardousWasteTotal });
    }
    
    if (bp6.radioactiveWasteTotal !== undefined) {
      wasteData.push({ name: 'Rifiuti radioattivi', value: bp6.radioactiveWasteTotal });
    }
  }
  
  // BP10-11 Work-life balance and apprentices
  const workLifeData = [];
  if (bp10.maleFamilyLeaveEligible !== undefined || bp10.femaleFamilyLeaveEligible !== undefined) {
    workLifeData.push({ 
      name: 'Congedo familiare',
      male: bp10.maleFamilyLeaveUsed || 0,
      female: bp10.femaleFamilyLeaveUsed || 0
    });
  }
  
  const apprenticesData = [];
  if (bp11.hasApprentices && bp11.apprenticesNumber !== undefined) {
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
