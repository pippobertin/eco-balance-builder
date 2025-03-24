import React, { useEffect, useState } from 'react';
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
  
  // Track if parent form updates are in progress to prevent loops
  const [isUpdatingParent, setIsUpdatingParent] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Force reload when reportId changes
  useEffect(() => {
    if (reportId) {
      console.log("ComplianceForm - reportId changed, reloading data:", reportId);
      loadData();
    }
  }, [reportId, loadData]);
  
  // Update local state when form data changes
  useEffect(() => {
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
    if (!isLoading && formData && handleChange && !isUpdatingParent) {
      // Only sync to parent on initial load, not on every formData change
      if (isInitialLoad) {
        console.log("ComplianceForm - Updating parent with loaded compliance data:", formData);
        setIsUpdatingParent(true);
        
        // Create synthetic events to update parent form
        if (formData.complianceStandards !== undefined) {
          const standardsEvent = {
            target: {
              name: 'complianceStandards',
              value: formData.complianceStandards
            }
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleChange(standardsEvent);
        }
        
        if (formData.complianceMonitoring !== undefined) {
          const monitoringEvent = {
            target: {
              name: 'complianceMonitoring',
              value: formData.complianceMonitoring
            }
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleChange(monitoringEvent);
        }
        
        // Mark initial load as complete
        setIsInitialLoad(false);
        
        // Small delay to avoid loops
        setTimeout(() => {
          setIsUpdatingParent(false);
        }, 100);
      }
    }
  }, [formData, isLoading, handleChange, isUpdatingParent, isInitialLoad]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Stop if we're in the process of updating parent
    if (isUpdatingParent) return;
    
    // Update local form data
    console.log("ComplianceForm - Updating local form data for field:", name, value);
    setFormData({ [name]: value });
    
    if (handleChange) {
      console.log("ComplianceForm - Calling parent handleChange for field:", name, value);
      handleChange(e);
    }
    
    if (setLocalNeedsSaving) {
      setLocalNeedsSaving(true);
    }
  };
  
  // Get the correct value to display - always from parent if available, otherwise from local
  const getDisplayValue = (fieldName: string) => {
    // If parent value exists and is not undefined, use it
    if (formValues && fieldName in formValues && formValues[fieldName] !== undefined) {
      return formValues[fieldName];
    }
    // Otherwise fall back to local form data
    return formData[fieldName as keyof typeof formData] || '';
  };
  
  const handleSave = async () => {
    console.log("ComplianceForm - Save button clicked");
    
    // Get the most up-to-date data to save
    const dataToSave = {
      complianceStandards: getDisplayValue('complianceStandards'),
      complianceMonitoring: getDisplayValue('complianceMonitoring')
    };
    
    console.log("ComplianceForm - Saving data:", dataToSave);
    
    const success = await saveData(dataToSave);
    
    if (success && setLocalNeedsSaving) {
      setLocalNeedsSaving(false);
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
          value={getDisplayValue('complianceStandards')}
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
          value={getDisplayValue('complianceMonitoring')}
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
