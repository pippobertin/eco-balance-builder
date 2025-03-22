
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

  // Load data
  const { loadData } = useComplianceLoad(reportId, setFormData, setIsLoading, setLastSaved);
  
  // Get save function
  const { saveData } = useComplianceSave(reportId, formData, setIsSaving, setLastSaved);

  // Monitor changes to formData to set needsSaving flag
  useEffect(() => {
    if (!isLoading && formData && (formData.complianceStandards || formData.complianceMonitoring)) {
      console.log("Setting needsSaving flag due to form data change in useComplianceData");
      setNeedsSaving(true);
    }
  }, [formData, isLoading, setNeedsSaving]);

  // Expose the loadData function so it can be called by parent components
  const handleLoadData = useCallback(() => {
    console.log("useComplianceData - handleLoadData called for reportId:", reportId);
    if (reportId) {
      loadData();
    }
  }, [reportId, loadData]);

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    lastSaved,
    saveData,
    loadData: handleLoadData
  };
};
