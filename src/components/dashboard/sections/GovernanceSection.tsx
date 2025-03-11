
import React from 'react';
import { ReportData } from '@/context/types';
import { Shield } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';
import { useNavigate } from 'react-router-dom';

interface GovernanceSectionProps {
  reportData: ReportData;
  companyName?: string;
}

const GovernanceSection: React.FC<GovernanceSectionProps> = ({ reportData, companyName }) => {
  const navigate = useNavigate();
  
  const {
    governanceCompliance,
    codeOfConductViolations,
    policyAdherence,
    riskManagement,
    antiCorruptionTraining,
    sustainabilityCommittee
  } = reportData.conductMetrics || {};

  // B8: Compliance
  const complianceData = [];
  if (governanceCompliance) {
    complianceData.push({ name: 'Conformità', value: governanceCompliance });
  }
  if (typeof codeOfConductViolations === 'number') {
    complianceData.push({ name: 'Violazioni', value: codeOfConductViolations });
  }

  // B9: Policy adherence
  const policyData = [];
  if (policyAdherence) {
    policyData.push({ name: 'Aderenza Policy', value: policyAdherence });
  }

  // B10: Risk management
  const riskData = [];
  if (riskManagement) {
    riskData.push({ name: 'Gestione Rischi', value: riskManagement });
  }

  // B12: Ethics and sustainability
  const ethicsData = [];
  if (antiCorruptionTraining) {
    ethicsData.push({ name: 'Formazione Anticorruzione', value: antiCorruptionTraining });
  }
  if (sustainabilityCommittee) {
    ethicsData.push({ name: 'Comitato Sostenibilità', value: sustainabilityCommittee });
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-purple-500" />
        <h2 className="text-xl font-bold text-gray-900">
          Metriche di Governance
          {companyName && <span className="text-purple-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricChart
          title="B8 - Conformità"
          description="Conformità e violazioni del codice etico"
          type={complianceData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: complianceData, colors: ['#5856D6', '#FF3B30'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'compliance' } })}
        />
        
        <MetricChart
          title="B9 - Politiche"
          description="Aderenza alle politiche aziendali"
          type={policyData.length > 0 ? "bar" : "empty"}
          data={policyData}
          dataKey="name"
          categories={["value"]}
          colors={['#34C759']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'policy' } })}
        />
        
        <MetricChart
          title="B10 - Gestione Rischi"
          description="Valutazione e gestione dei rischi"
          type={riskData.length > 0 ? "bar" : "empty"}
          data={riskData}
          dataKey="name"
          categories={["value"]}
          colors={['#FF9500']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'risk' } })}
        />
        
        <MetricChart
          title="B12 - Etica e Sostenibilità"
          description="Formazione e governance della sostenibilità"
          type={ethicsData.length > 0 ? "donut" : "empty"}
          data={[{ ring: 'inner', data: ethicsData, colors: ['#007AFF', '#BF5AF2'] }]}
          dataKey="name"
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'ethics' } })}
        />
      </div>
    </div>
  );
};

export default GovernanceSection;
