
import React, { useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SaveButton from './SaveButton';
import { useComplianceData } from './hooks';
import { ComplianceFormData } from './hooks/types';
import { Loader2 } from 'lucide-react';

interface ComplianceFormProps {
  reportId: string | undefined;
  formValues?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setLocalLastSaved?: React.Dispatch<React.SetStateAction<Date | null>>;
  setLocalNeedsSaving?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ComplianceForm: React.FC<ComplianceFormProps> = ({ 
  reportId,
  formValues,
  handleChange,
  setLocalLastSaved,
  setLocalNeedsSaving
}) => {
  const { 
    formData, 
    setFormData, 
    saveData, 
    isSaving, 
    isLoading, 
    lastSaved,
    loadData
  } = useComplianceData(reportId || '');
  
  // Force reload when reportId changes
  useEffect(() => {
    if (reportId) {
      console.log("ComplianceForm - reportId changed, reloading data:", reportId);
      loadData();
    }
  }, [reportId, loadData]);
  
  // Update local state when form data changes
  useEffect(() => {
    if (setLocalNeedsSaving && (formData.complianceStandards || formData.complianceMonitoring)) {
      setLocalNeedsSaving(true);
    }
  }, [formData, setLocalNeedsSaving]);

  // Update local last saved when saving is complete
  useEffect(() => {
    if (setLocalLastSaved && lastSaved) {
      setLocalLastSaved(lastSaved);
    }
  }, [lastSaved, setLocalLastSaved]);
  
  const handleLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (handleChange) {
      console.log("ComplianceForm - Calling parent handleChange for field:", name, value);
      handleChange(e);
    } else {
      console.log("ComplianceForm - Using local setFormData for field:", name, value);
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (setLocalNeedsSaving) {
        setLocalNeedsSaving(true);
      }
    }
  };
  
  // Determine which data to display - use parent form values if provided, otherwise use local state
  const displayData = formValues || formData;

  // Log data for debugging
  useEffect(() => {
    console.log("ComplianceForm - Current formData:", formData);
    console.log("ComplianceForm - Display data:", displayData);
  }, [formData, displayData]);
  
  const handleSave = async () => {
    console.log("ComplianceForm - Save button clicked with data:", displayData);
    
    if (handleChange) {
      // We're in a parent-controlled mode, so we need to extract the compliance data
      const dataToSave = {
        complianceStandards: displayData.complianceStandards || '',
        complianceMonitoring: displayData.complianceMonitoring || ''
      };
      const success = await saveData(dataToSave);
      
      if (success && setLocalNeedsSaving) {
        setLocalNeedsSaving(false);
      }
    } else {
      // We're in local state mode
      const success = await saveData();
      
      if (success && setLocalNeedsSaving) {
        setLocalNeedsSaving(false);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        <p>Caricamento dati compliance...</p>
      </div>
    );
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
      
      <div className="flex justify-end mt-6">
        <SaveButton onClick={handleSave} isLoading={isSaving} />
      </div>
    </div>
  );
};

export default ComplianceForm;
