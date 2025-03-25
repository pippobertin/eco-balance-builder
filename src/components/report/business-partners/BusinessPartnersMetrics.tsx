
import React from 'react';
import { useReport } from '@/context/ReportContext';
import { Info } from 'lucide-react';
import { 
  BP1RevenueSectors,
  BP2GenderDiversity,
  BP3GHGReductionTargets,
  BP4TransitionPlan,
  BP5PhysicalClimateRisks,
  BP6HazardousWaste,
  BP7PolicyAlignment,
  BP8ComplianceProcesses,
  BP9Violations,
  BP10WorkLifeBalance,
  BP11Apprentices
} from './modules';
import BPNavigationTabs from './components/BPNavigationTabs';
import { useBPNavigation } from './hooks/useBPNavigation';
import { useBPModuleData } from './hooks/useBPModuleData';

interface BusinessPartnersMetricsProps {
  initialField?: string;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ initialField }) => {
  const { currentReport } = useReport();
  const { activeTab, refs, navigateTo } = useBPNavigation(initialField);
  const bpData = currentReport ? useBPModuleData(currentReport.id) : null;
  
  if (!currentReport) {
    return <div className="p-4">Nessun report selezionato</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Modulo Partner Commerciali</h2>
        
        {/* Descrizione del modulo */}
        <div className="p-4 rounded-md mb-6 bg-slate-100">
          <div className="flex items-start">
            <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Questo modulo individua elementi d'informativa in relazione alle informazioni generalmente richieste dai partner commerciali, dagli investitori e dai finanziatori dell'impresa. Le informative da BP1 a BP11 devono essere considerate e comunicate se applicabili o rilevanti per l'attività dell'impresa.
            </p>
          </div>
        </div>
        
        {/* Navigazione rapida */}
        <BPNavigationTabs 
          activeTab={activeTab} 
          onTabChange={navigateTo} 
        />
      </div>
      
      {/* BP1 - Ricavi in alcuni settori */}
      <div ref={refs.bp1}>
        <BP1RevenueSectors reportId={currentReport.id} />
      </div>
      
      {/* BP2 - Diversità di genere nella governance */}
      <div ref={refs.bp2}>
        <BP2GenderDiversity reportId={currentReport.id} />
      </div>
      
      {/* BP3 - Obiettivi di riduzione GHG */}
      <div ref={refs.bp3}>
        <BP3GHGReductionTargets reportId={currentReport.id} />
      </div>
      
      {/* BP4 - Piano di transizione climatica */}
      <div ref={refs.bp4}>
        <BP4TransitionPlan reportId={currentReport.id} />
      </div>
      
      {/* BP5 - Rischi fisici legati al clima */}
      <div ref={refs.bp5}>
        <BP5PhysicalClimateRisks reportId={currentReport.id} />
      </div>
      
      {/* BP6 - Rifiuti pericolosi */}
      <div ref={refs.bp6}>
        <BP6HazardousWaste reportId={currentReport.id} />
      </div>
      
      {/* BP7 - Allineamento delle politiche */}
      <div ref={refs.bp7}>
        <BP7PolicyAlignment reportId={currentReport.id} />
      </div>
      
      {/* BP8 - Processi di conformità */}
      <div ref={refs.bp8}>
        <BP8ComplianceProcesses reportId={currentReport.id} />
      </div>
      
      {/* BP9 - Violazioni */}
      <div ref={refs.bp9}>
        <BP9Violations reportId={currentReport.id} />
      </div>
      
      {/* BP10 - Equilibrio vita-lavoro */}
      <div ref={refs.bp10}>
        <BP10WorkLifeBalance reportId={currentReport.id} />
      </div>
      
      {/* BP11 - Apprendisti */}
      <div ref={refs.bp11}>
        <BP11Apprentices reportId={currentReport.id} />
      </div>
    </div>
  );
};

export default BusinessPartnersMetrics;
