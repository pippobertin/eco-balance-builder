
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportData } from '@/context/types';
import { Shield } from 'lucide-react';
import MetricChart from '@/components/dashboard/MetricChart';

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
  
  // Prepara i dati per i grafici di governance (B8-B12)
  
  // B8: Governance Compliance
  const complianceData = [];
  if (typeof governanceCompliance === 'number' && governanceCompliance > 0) {
    complianceData.push({
      name: 'Conformità Governance',
      value: governanceCompliance
    });
  }
  
  if (typeof codeOfConductViolations === 'number') {
    complianceData.push({
      name: 'Violazioni Codice Etico',
      value: codeOfConductViolations
    });
  }
  
  // B9-B10: Politiche e rischi
  const policyData = [];
  if (typeof policyAdherence === 'number' && policyAdherence > 0) {
    policyData.push({
      name: 'Aderenza alle Policy',
      value: policyAdherence
    });
  }
  
  if (typeof riskManagement === 'number' && riskManagement > 0) {
    policyData.push({
      name: 'Gestione Rischi',
      value: riskManagement
    });
  }
  
  // B11-B12: Altri indicatori di governance
  const diversityData = [];
  if (typeof boardDiversity === 'number' && boardDiversity > 0) {
    diversityData.push({
      name: 'Diversità CdA',
      value: boardDiversity
    });
  }
  
  if (typeof executivePayRatio === 'number' && executivePayRatio > 0) {
    diversityData.push({
      name: 'Rapporto Retributivo',
      value: executivePayRatio
    });
  }
  
  // Anticorruzione e sostenibilità
  const ethicsData = [];
  if (typeof antiCorruptionTraining === 'number' && antiCorruptionTraining > 0) {
    ethicsData.push({
      name: 'Formazione Anticorruzione',
      value: antiCorruptionTraining
    });
  }
  
  if (typeof sustainabilityCommittee === 'number' && sustainabilityCommittee > 0) {
    ethicsData.push({
      name: 'Comitato Sostenibilità',
      value: sustainabilityCommittee
    });
  }
  
  // Navigation handlers - Fixed to navigate to the correct report section
  const handleComplianceClick = () => {
    navigate('/report-form', { state: { section: 'conduct', field: 'compliance' } });
  };
  
  const handlePolicyRiskClick = () => {
    navigate('/report-form', { state: { section: 'conduct', field: 'policyRisk' } });
  };
  
  const handleDiversityClick = () => {
    navigate('/report-form', { state: { section: 'conduct', field: 'diversity' } });
  };
  
  const handleEthicsClick = () => {
    navigate('/report-form', { state: { section: 'conduct', field: 'ethics' } });
  };
  
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
        {/* B8: Grafico compliance */}
        <MetricChart
          title="Compliance (B8)"
          description="Indicatori di conformità alle normative"
          type={complianceData.length > 0 ? "bar" : "empty"}
          data={complianceData}
          dataKey="name"
          categories={["value"]}
          colors={["#5856D6", "#FF3B30"]}
          onTitleClick={handleComplianceClick}
        />
        
        {/* B9-10: Politiche e rischi */}
        <MetricChart
          title="Politiche e Rischi (B9-B10)"
          description="Gestione delle politiche aziendali e dei rischi"
          type={policyData.length > 0 ? "bar" : "empty"}
          data={policyData}
          dataKey="name"
          categories={["value"]}
          colors={["#34C759", "#FF9500"]}
          onTitleClick={handlePolicyRiskClick}
        />
        
        {/* B11: Diversità e retribuzione */}
        <MetricChart
          title="Diversità e Retribuzione (B11)"
          description="Diversità nel CdA e rapporti retributivi"
          type={diversityData.length > 0 ? "bar" : "empty"}
          data={diversityData}
          dataKey="name"
          categories={["value"]}
          colors={["#5AC8FA", "#FF2D55"]}
          onTitleClick={handleDiversityClick}
        />
        
        {/* B12: Etica e sostenibilità */}
        <MetricChart
          title="Etica e Sostenibilità (B12)"
          description="Formazione etica e strutture di sostenibilità"
          type={ethicsData.length > 0 ? "bar" : "empty"}
          data={ethicsData}
          dataKey="name"
          categories={["value"]}
          colors={["#007AFF", "#BF5AF2"]}
          onTitleClick={handleEthicsClick}
        />
      </div>
    </div>
  );
};

export default GovernanceSection;
