
import { useState, useEffect, useCallback } from 'react';
import { ComplianceFormData } from './types';
import { useReport } from '@/hooks/use-report-context';
import { useComplianceLoad } from './useComplianceLoad';
import { useComplianceSave } from './useComplianceSave';

export const useComplianceData = (reportId: string) => {
  const [formData, setFormData] = useState<ComplianceFormData>({
    complianceStandards: '',
    complianceMonitoring: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { setNeedsSaving } = useReport();

  // Get load function - pass in the state setters
  const { loadData } = useComplianceLoad(reportId, setFormData, setIsLoading, setLastSaved);
  
  // Get save function - pass in the current form data
  const { saveData } = useComplianceSave(reportId, formData, setIsSaving, setLastSaved);

  // Initial load when component mounts or reportId changes
  useEffect(() => {
    if (reportId) {
      console.log("useComplianceData - Loading data for reportId:", reportId);
      loadData();
    }
  }, [reportId, loadData]);

  // Update formData with new values
  const updateFormData = useCallback((newData: Partial<ComplianceFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Only set needsSaving if there's an actual difference in data
      const hasChanges = 
        prev.complianceStandards !== updated.complianceStandards || 
        prev.complianceMonitoring !== updated.complianceMonitoring;
      
      if (hasChanges && !isLoading) {
        console.log("Setting needsSaving flag due to form data change in useComplianceData");
        setNeedsSaving(true);
      }
      
      return updated;
    });
  }, [isLoading, setNeedsSaving]);

  // Expose the loadData function so it can be called by parent components if needed
  const handleLoadData = useCallback(() => {
    console.log("useComplianceData - handleLoadData called for reportId:", reportId);
    if (reportId) {
      loadData();
    }
  }, [reportId, loadData]);

  return {
    formData,
    setFormData: updateFormData,
    isLoading,
    isSaving,
    lastSaved,
    saveData,
    loadData: handleLoadData
  };
};
