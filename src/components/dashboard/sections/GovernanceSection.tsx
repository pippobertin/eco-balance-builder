
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
    boardDiversity,
    executivePayRatio,
    sustainabilityCommittee
  } = reportData.conductMetrics || {};

  // B8: Compliance data
  const complianceData = [];
  if (governanceCompliance) {
    complianceData.push({ name: 'Conformità', value: governanceCompliance });
  }
  if (typeof codeOfConductViolations === 'number') {
    complianceData.push({ name: 'Violazioni', value: codeOfConductViolations });
  }

  // B9-B10: Policy and risk data
  const policyRiskData = [];
  if (policyAdherence) {
    policyRiskData.push({ name: 'Aderenza Policy', value: policyAdherence });
  }
  if (riskManagement) {
    policyRiskData.push({ name: 'Gestione Rischi', value: riskManagement });
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
          Performance di Governance
          {companyName && <span className="text-purple-500 ml-2">({companyName})</span>}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricChart
          title="Compliance (B8)"
          description="Conformità e violazioni del codice etico"
          type={complianceData.length > 0 ? "bar" : "empty"}
          data={complianceData}
          dataKey="name"
          categories={["value"]}
          colors={['#5856D6', '#FF3B30']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'compliance' } })}
        />
        
        <MetricChart
          title="Politiche e Rischi (B9-B10)"
          description="Gestione politiche e rischi"
          type={policyRiskData.length > 0 ? "bar" : "empty"}
          data={policyRiskData}
          dataKey="name"
          categories={["value"]}
          colors={['#34C759', '#FF9500']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'policyRisk' } })}
        />
        
        <MetricChart
          title="Etica e Sostenibilità (B12)"
          description="Formazione e strutture di sostenibilità"
          type={ethicsData.length > 0 ? "bar" : "empty"}
          data={ethicsData}
          dataKey="name"
          categories={["value"]}
          colors={['#007AFF', '#BF5AF2']}
          onTitleClick={() => navigate('/report', { state: { activeTab: 'metrics', section: 'conduct', field: 'ethics' } })}
        />
      </div>
    </div>
  );
};

export default GovernanceSection;
