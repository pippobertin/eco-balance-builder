
import { useState, useEffect } from 'react';
import { ComplianceData, ComplianceFormData } from './types';
import { useReport } from '@/context/ReportContext';

export const useComplianceData = (reportId: string) => {
  const [formData, setFormData] = useState<ComplianceFormData>({
    complianceStandards: '',
    complianceMonitoring: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { setNeedsSaving } = useReport();

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
    setIsLoading
  };
};
