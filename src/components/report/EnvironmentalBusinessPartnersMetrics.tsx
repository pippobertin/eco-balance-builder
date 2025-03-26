
import React, { useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { useReport } from '@/hooks/use-report-context';
import {
  BP1RevenueSectors,
  BP2GenderDiversity,
  BP3GHGReductionTargets,
  BP4TransitionPlan
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

      {/* BP4 - Piano di transizione climatica */}
      <div ref={bp4Ref}>
        <BP4TransitionPlan reportId={reportId} />
      </div>
    </div>
  );
};

export default EnvironmentalBusinessPartnersMetrics;
