import React from 'react';
import { useReport } from '@/context/ReportContext';
import { Info } from 'lucide-react';
import BP1RevenueSectors from './BP1RevenueSectors';

interface BusinessPartnersMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  reportId: string;
}

const BusinessPartnersMetrics: React.FC<BusinessPartnersMetricsProps> = ({
  formValues,
  setFormValues,
  reportId
}) => {
  // Use the custom hook to handle business partners data
  const {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  } = useBusinessPartnersData(reportId);

  // Update the global form values when our local state changes
  React.useEffect(() => {
    if (!isLoading) {
      setFormValues((prev: any) => ({
        ...prev,
        businessPartnersMetrics: formData
      }));
    }
  }, [formData, isLoading, setFormValues]);

  // Initialize our local state from global form values if available
  React.useEffect(() => {
    if (formValues.businessPartnersMetrics && Object.keys(formValues.businessPartnersMetrics).length > 0) {
      setFormData(formValues.businessPartnersMetrics);
    }
  }, []);

  if (isLoading) {
    return <div className="p-4">Caricamento dati...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Modulo Partner Commerciali</h2>
      
      <div className="p-4 rounded-md mb-4 bg-slate-100">
        <div className="flex items-start">
          <Info className="mt-0.5 mr-2 h-4 w-4 text-blue-500" />
          <p className="text-sm text-slate-600">
            Questo modulo individua elementi d'informativa in relazione alle informazioni generalmente richieste dai partner commerciali, dagli investitori e dai finanziatori dell'impresa. Le informative da BP1 a BP11 devono essere considerate e comunicate se applicabili o rilevanti per l'attività dell'impresa.
          </p>
        </div>
      </div>

      {/* BP1 - Ricavi in alcuni settori */}
      <BP1RevenueSectors 
        formData={formData}
        setFormData={setFormData}
        saveData={saveData}
        lastSaved={lastSaved.bp1}
        needsSaving={needsSaving.bp1}
        bpKey="bp1"
      />
      
      {/* Other BP modules will be added here */}
    </div>
  );
};

export default BusinessPartnersMetrics;
