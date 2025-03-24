
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
  const [localNeedsSaving, setLocalNeedsSaving] = useState(false);

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

  // Monitor changes to formData to set needsSaving flag
  // Only run when localNeedsSaving changes to prevent continuous loops
  useEffect(() => {
    if (localNeedsSaving && !isLoading) {
      console.log("Setting needsSaving flag due to form data change in useComplianceData");
      setNeedsSaving(true);
    }
  }, [localNeedsSaving, isLoading, setNeedsSaving]);

  // Update formData and trigger needsSaving
  const updateFormData = useCallback((newData: Partial<ComplianceFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      setLocalNeedsSaving(true);
      return updated;
    });
  }, []);

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
