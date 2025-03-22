
import { useState, useEffect } from 'react';
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
  useComplianceLoad(reportId, setFormData, setIsLoading, setLastSaved);
  
  // Get save function
  const { saveData } = useComplianceSave(reportId, formData, setIsSaving, setLastSaved);

  // Monitor changes to formData to set needsSaving flag
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading, setNeedsSaving]);

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    lastSaved,
    saveData
  };
};
