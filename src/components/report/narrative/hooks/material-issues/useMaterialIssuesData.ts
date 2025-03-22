
import { useState, useEffect } from 'react';
import { MaterialIssuesFormData } from '../types';
import { useReport } from '@/context/ReportContext';

export const useMaterialIssuesData = (reportId: string) => {
  const [formData, setFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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
    setIsLoading,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved
  };
};
