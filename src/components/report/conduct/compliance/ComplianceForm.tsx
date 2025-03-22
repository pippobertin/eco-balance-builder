import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SaveButton from './SaveButton';
import { useComplianceData, useComplianceLoad } from './hooks';
import { ComplianceFormData } from './hooks/types';

interface ComplianceFormProps {
  reportId: string | undefined;
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ComplianceForm: React.FC<ComplianceFormProps> = ({ 
  reportId,
  formValues,
  handleChange
}) => {
  const { formData, setFormData, saveData, isSaving, isLoading } = useComplianceData(reportId || '');
  
  useComplianceLoad(reportId || '', setFormData);
  
  const handleLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (handleChange) {
      handleChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const displayData: ComplianceFormData = formValues?.conductMetrics || formData;
  
  if (isLoading) {
    return <div className="p-4 text-center">Caricamento dati compliance...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="complianceStandards">Standard di compliance adottati</Label>
        <Textarea
          id="complianceStandards"
          name="complianceStandards"
          placeholder="Descrivi gli standard, codici di condotta, linee guida o altri strumenti adottati dall'azienda per assicurare la compliance"
          value={displayData.complianceStandards || ''}
          onChange={handleLocalChange}
          className="min-h-[120px]"
        />
      </div>
      
      <div>
        <Label htmlFor="complianceMonitoring">Monitoraggio della compliance</Label>
        <Textarea
          id="complianceMonitoring"
          name="complianceMonitoring"
          placeholder="Descrivi come l'azienda monitora il rispetto degli standard di compliance (es. audit interni, certificazioni esterne)"
          value={displayData.complianceMonitoring || ''}
          onChange={handleLocalChange}
          className="min-h-[120px]"
        />
      </div>
      
      {!handleChange && (
        <div className="flex justify-end mt-6">
          <SaveButton onClick={saveData} isLoading={isSaving} />
        </div>
      )}
    </div>
  );
};

export default ComplianceForm;
