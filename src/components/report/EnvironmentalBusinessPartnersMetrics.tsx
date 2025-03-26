
import React, { useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { useReport } from '@/hooks/use-report-context';
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
} from './business-partners/modules';

interface EnvironmentalBusinessPartnersMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const EnvironmentalBusinessPartnersMetrics: React.FC<EnvironmentalBusinessPartnersMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const bp1Ref = useRef<HTMLDivElement>(null);
  const bp2Ref = useRef<HTMLDivElement>(null);
  const bp3Ref = useRef<HTMLDivElement>(null);
  const bp4Ref = useRef<HTMLDivElement>(null);
  const bp5Ref = useRef<HTMLDivElement>(null);
  const bp6Ref = useRef<HTMLDivElement>(null);
  const bp7Ref = useRef<HTMLDivElement>(null);
  const bp8Ref = useRef<HTMLDivElement>(null);
  const bp9Ref = useRef<HTMLDivElement>(null);
  const bp10Ref = useRef<HTMLDivElement>(null);
  const bp11Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialField) {
      if (initialField === 'bp1' && bp1Ref.current) {
        bp1Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp2' && bp2Ref.current) {
        bp2Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp3' && bp3Ref.current) {
        bp3Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp4' && bp4Ref.current) {
        bp4Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp5' && bp5Ref.current) {
        bp5Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp6' && bp6Ref.current) {
        bp6Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp7' && bp7Ref.current) {
        bp7Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp8' && bp8Ref.current) {
        bp8Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp9' && bp9Ref.current) {
        bp9Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp10' && bp10Ref.current) {
        bp10Ref.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'bp11' && bp11Ref.current) {
        bp11Ref.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

  if (!reportId) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Partner Commerciali (Visualizzazione Alternativa)</h2>
      <p className="text-gray-600">
        Compila i dati relativi ai partner commerciali dell'impresa. Ogni sezione può essere compilata e salvata indipendentemente.
      </p>
      
      {/* BP1 - Ricavi in settori specifici */}
      <div ref={bp1Ref}>
        <BP1RevenueSectors reportId={reportId} />
      </div>
      
      {/* BP2 - Diversità di genere nella governance */}
      <div ref={bp2Ref}>
        <BP2GenderDiversity reportId={reportId} />
      </div>
      
      {/* BP3 - Obiettivi riduzione emissioni GHG */}
      <div ref={bp3Ref}>
        <BP3GHGReductionTargets reportId={reportId} />
      </div>
      
      {/* BP4 - Piano di transizione */}
      <div ref={bp4Ref}>
        <BP4TransitionPlan reportId={reportId} />
      </div>
      
      {/* BP5 - Rischi climatici fisici */}
      <div ref={bp5Ref}>
        <BP5PhysicalClimateRisks reportId={reportId} />
      </div>
      
      {/* BP6 - Rifiuti pericolosi */}
      <div ref={bp6Ref}>
        <BP6HazardousWaste reportId={reportId} />
      </div>
      
      {/* BP7 - Allineamento delle politiche */}
      <div ref={bp7Ref}>
        <BP7PolicyAlignment reportId={reportId} />
      </div>
      
      {/* BP8 - Processi di conformità */}
      <div ref={bp8Ref}>
        <BP8ComplianceProcesses reportId={reportId} />
      </div>
      
      {/* BP9 - Violazioni */}
      <div ref={bp9Ref}>
        <BP9Violations reportId={reportId} />
      </div>
      
      {/* BP10 - Equilibrio vita-lavoro */}
      <div ref={bp10Ref}>
        <BP10WorkLifeBalance reportId={reportId} />
      </div>
      
      {/* BP11 - Apprendisti */}
      <div ref={bp11Ref}>
        <BP11Apprentices reportId={reportId} />
      </div>
    </div>
  );
};

export default EnvironmentalBusinessPartnersMetrics;
