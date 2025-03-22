
import { useState, useEffect } from 'react';
import { MaterialIssuesFormData } from '../types';
import { useReport } from '@/context/ReportContext';
import { useMaterialIssuesLoad } from './useMaterialIssuesLoad';
import { useMaterialIssuesSave } from './useMaterialIssuesSave';

export const useMaterialIssuesData = (reportId: string) => {
  const [formData, setFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { setNeedsSaving } = useReport();

  // Load data using the load hook
  useMaterialIssuesLoad(reportId, setFormData, setIsLoading);
  
  // Get save function from the save hook
  const { saveData } = useMaterialIssuesSave(reportId, formData, setIsSaving, setLastSaved);

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
    setIsLoading,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    saveData
  };
};
