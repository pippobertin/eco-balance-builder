
import { useState } from 'react';
import { MaterialIssuesFormData } from '../types';

export const useMaterialIssuesData = (reportId: string) => {
  const [formData, setFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  // Track initial data state to detect actual changes
  const [initialFormData, setInitialFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
  });

  // Update formData with setter that tracks changes against initialFormData
  const updateFormData = (newData: Partial<MaterialIssuesFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Only set needsSaving if there's a difference between updated and initial data
      if (updated.materialIssuesDescription !== initialFormData.materialIssuesDescription) {
        setNeedsSaving(true);
      } else {
        setNeedsSaving(false);
      }
      
      return updated;
    });
  };

  return {
    formData,
    setFormData: updateFormData,
    initialFormData,
    setInitialFormData,
    isLoading,
    setIsLoading,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
