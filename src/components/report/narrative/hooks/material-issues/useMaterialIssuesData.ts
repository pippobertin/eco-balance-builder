
import { useState } from 'react';
import { MaterialIssuesFormData, SectionHookResult } from '../types';

export const useMaterialIssuesData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
