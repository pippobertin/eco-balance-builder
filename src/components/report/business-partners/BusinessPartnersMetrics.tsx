
import React from 'react';
import { useReport } from '@/context/ReportContext';
import { BP1RevenueSectors, BP2GenderDiversity, BP3GHGReductionTargets, BP4TransitionPlan, 
  BP5PhysicalClimateRisks, BP6HazardousWaste, BP7PolicyAlignment, BP8ComplianceProcesses, 
  BP9Violations, BP10WorkLifeBalance, BP11Apprentices } from './modules';

interface BusinessPartnersMetricsProps {
  formValues?: any;
  setFormValues?: React.Dispatch<React.SetStateAction<any>>;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({ formValues, setFormValues }) => {
  const { currentReport } = useReport();
  
  if (!currentReport) {
    return <div className="p-4 text-center">Seleziona un report per visualizzare i dati sui partner commerciali</div>;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Partner Commerciali</h2>
      <p className="text-gray-600">
        Compila i dati relativi ai partner commerciali dell'impresa. Ogni sezione può essere compilata e salvata indipendentemente.
      </p>
      
      <div className="space-y-6">
        <BP1RevenueSectors reportId={currentReport.id} />
        <BP2GenderDiversity reportId={currentReport.id} />
        <BP3GHGReductionTargets reportId={currentReport.id} />
        <BP4TransitionPlan reportId={currentReport.id} />
        <BP5PhysicalClimateRisks reportId={currentReport.id} />
        <BP6HazardousWaste reportId={currentReport.id} />
        <BP7PolicyAlignment reportId={currentReport.id} />
        <BP8ComplianceProcesses reportId={currentReport.id} />
        <BP9Violations reportId={currentReport.id} />
        <BP10WorkLifeBalance reportId={currentReport.id} />
        <BP11Apprentices reportId={currentReport.id} />
      </div>
    </div>
  );
};

export default BusinessPartnersMetrics;
