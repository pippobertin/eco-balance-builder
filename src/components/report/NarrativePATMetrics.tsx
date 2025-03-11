
import React from 'react';
import StrategySection from './narrative/StrategySection';
import MaterialIssuesSection from './narrative/MaterialIssuesSection';
import MaterialIssuesManagementSection from './narrative/MaterialIssuesManagementSection';
import StakeholdersSection from './narrative/StakeholdersSection';
import GovernanceSection from './narrative/GovernanceSection';

interface NarrativePATMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const NarrativePATMetrics: React.FC<NarrativePATMetricsProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      narrativePATMetrics: {
        ...prev.narrativePATMetrics,
        [name]: value
      }
    }));
  };

  // Raggruppare gli stakeholder per categoria per una migliore visualizzazione
  const stakeholdersByCategory = React.useMemo(() => {
    if (!formValues.materialityAnalysis?.stakeholders || formValues.materialityAnalysis.stakeholders.length === 0) {
      return {};
    }

    return formValues.materialityAnalysis.stakeholders.reduce((acc: any, stakeholder: any) => {
      if (!acc[stakeholder.category]) {
        acc[stakeholder.category] = [];
      }
      acc[stakeholder.category].push(stakeholder);
      return acc;
    }, {});
  }, [formValues.materialityAnalysis?.stakeholders]);

  // Calcola statistiche per i sondaggi degli stakeholder
  const surveyStats = React.useMemo(() => {
    if (!formValues.materialityAnalysis?.stakeholders) {
      return { total: 0, sent: 0, completed: 0 };
    }

    const stakeholders = formValues.materialityAnalysis.stakeholders;
    return {
      total: stakeholders.length,
      sent: stakeholders.filter((s: any) => s.surveyStatus === 'sent').length,
      completed: stakeholders.filter((s: any) => s.surveyStatus === 'completed').length
    };
  }, [formValues.materialityAnalysis?.stakeholders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Narrativo - Politiche, Azioni e Obiettivi (PAT)</h2>
      
      {/* N1 - Strategia: modello aziendale e iniziative di sostenibilità */}
      <StrategySection 
        formValues={formValues} 
        handleChange={handleChange} 
      />
      
      {/* N2 - Questioni rilevanti di sostenibilità */}
      <MaterialIssuesSection 
        formValues={formValues} 
        handleChange={handleChange} 
      />
      
      {/* N3 - Gestione delle questioni rilevanti di sostenibilità */}
      <MaterialIssuesManagementSection 
        formValues={formValues} 
        handleChange={handleChange} 
      />
      
      {/* N4 - Principali portatori di interessi */}
      <StakeholdersSection 
        formValues={formValues} 
        handleChange={handleChange}
        stakeholdersByCategory={stakeholdersByCategory}
        surveyStats={surveyStats}
      />
      
      {/* N5 - Governance: responsabilità in materia di sostenibilità */}
      <GovernanceSection 
        formValues={formValues} 
        handleChange={handleChange} 
      />
    </div>
  );
};

export default NarrativePATMetrics;
