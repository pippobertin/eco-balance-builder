
import React from 'react';
import StrategySection from './narrative/StrategySection';
import MaterialIssuesSection from './narrative/MaterialIssuesSection';
import MaterialIssuesManagementSection from './narrative/MaterialIssuesManagementSection';
import StakeholdersSection from './narrative/StakeholdersSection';
import GovernanceSection from './narrative/GovernanceSection';
import { useReport } from '@/context/ReportContext';

const NarrativePATMetrics: React.FC = () => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id || '';

  // Ensure we have a valid reportId
  if (!reportId) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Errore: Nessun report selezionato</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Narrativo - Politiche, Azioni e Obiettivi (PAT)</h2>
      
      {/* N1 - Strategia: modello aziendale e iniziative di sostenibilità */}
      <StrategySection reportId={reportId} />
      
      {/* N2 - Questioni rilevanti di sostenibilità */}
      <MaterialIssuesSection reportId={reportId} />
      
      {/* N3 - Gestione delle questioni rilevanti di sostenibilità */}
      <MaterialIssuesManagementSection reportId={reportId} />
      
      {/* N4 - Principali portatori di interessi */}
      <StakeholdersSection reportId={reportId} />
      
      {/* N5 - Governance: responsabilità in materia di sostenibilità */}
      <GovernanceSection reportId={reportId} />
    </div>
  );
};

export default NarrativePATMetrics;
