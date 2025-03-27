
import React, { useEffect, useRef } from 'react';
import { useReport } from '@/hooks/use-report-context';
import BP1RevenueSectorsSection from './sections/BP1RevenueSectorsSection';
import BP2GenderDiversitySection from './sections/BP2GenderDiversitySection';
import BP3GHGReductionTargetsSection from './sections/BP3GHGReductionTargetsSection';
import BP4TransitionPlanSection from './sections/BP4TransitionPlanSection';
import BP5PhysicalClimateRisksSection from './sections/BP5PhysicalClimateRisksSection';
import BP6HazardousWasteSection from './sections/BP6HazardousWasteSection';
import BP7PolicyAlignmentSection from './sections/BP7PolicyAlignmentSection';
import BP8ComplianceProcessesSection from './sections/BP8ComplianceProcessesSection';
import BP9ViolationsSection from './sections/BP9ViolationsSection';
import BP10WorkLifeBalanceSection from './sections/BP10WorkLifeBalanceSection';
import BP11ApprenticesSection from './sections/BP11ApprenticesSection';

interface EnvironmentalBusinessPartnersProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const EnvironmentalBusinessPartners: React.FC<EnvironmentalBusinessPartnersProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  // Refs for scroll navigation
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

  if (!reportId) {
    return <div className="p-4 text-center">Seleziona un report per visualizzare i dati sui partner commerciali</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Partner Commerciali</h2>
      <p className="text-gray-600">
        Compila i dati relativi ai partner commerciali dell'impresa. Ogni sezione può essere compilata e salvata indipendentemente.
      </p>
      
      {/* BP1 - Ricavi in settori controversi */}
      <div ref={bp1Ref}>
        <BP1RevenueSectorsSection 
          reportId={reportId} 
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
      
      {/* BP2 - Diversità di genere nella governance */}
      <div ref={bp2Ref}>
        <BP2GenderDiversitySection 
          reportId={reportId} 
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
      
      {/* BP3 - Obiettivi riduzione GHG */}
      <div ref={bp3Ref}>
        <BP3GHGReductionTargetsSection 
          reportId={reportId} 
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP4 - Piano di transizione climatica */}
      <div ref={bp4Ref}>
        <BP4TransitionPlanSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP5 - Rischi fisici legati al clima */}
      <div ref={bp5Ref}>
        <BP5PhysicalClimateRisksSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP6 - Rifiuti pericolosi */}
      <div ref={bp6Ref}>
        <BP6HazardousWasteSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP7 - Allineamento delle politiche */}
      <div ref={bp7Ref}>
        <BP7PolicyAlignmentSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP8 - Processi di conformità */}
      <div ref={bp8Ref}>
        <BP8ComplianceProcessesSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>

      {/* BP9 - Violazioni */}
      <div ref={bp9Ref}>
        <BP9ViolationsSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
      
      {/* BP10 - Equilibrio vita-lavoro */}
      <div ref={bp10Ref}>
        <BP10WorkLifeBalanceSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
      
      {/* BP11 - Apprendisti */}
      <div ref={bp11Ref}>
        <BP11ApprenticesSection 
          reportId={reportId}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
    </div>
  );
};

export default EnvironmentalBusinessPartners;
