
import React, { useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SaveButton from './SaveButton';
import { useComplianceData } from './hooks';
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
    console.log("ComplianceForm - lastSaved updated:", lastSaved);
    if (setLocalLastSaved && lastSaved) {
      setLocalLastSaved(lastSaved);
    }
  }, [lastSaved, setLocalLastSaved]);
  
  // Reset needsSaving when data is loaded
  useEffect(() => {
    if (setLocalNeedsSaving) {
      if (isLoading) {
        // When loading, don't mark as needing save
        setLocalNeedsSaving(false);
      }
    }
  }, [isLoading, setLocalNeedsSaving]);

  // Update parent form values when compliance data is loaded and available
  useEffect(() => {
    if (!isLoading && formData && handleChange && formData.complianceStandards && formData.complianceMonitoring) {
      console.log("ComplianceForm - Updating parent with loaded compliance data:", formData);
      
      // Create synthetic events to update parent form
      const standardsEvent = {
        target: {
          name: 'complianceStandards',
          value: formData.complianceStandards
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      const monitoringEvent = {
        target: {
          name: 'complianceMonitoring',
          value: formData.complianceMonitoring
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      // Update parent form values
      handleChange(standardsEvent);
      handleChange(monitoringEvent);
    }
  }, [formData, isLoading, handleChange]);

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
  // Important - prioritize the parent form values for the display
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
