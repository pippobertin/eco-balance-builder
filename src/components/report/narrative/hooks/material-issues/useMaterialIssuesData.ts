
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

  // Create a wrapper function that conforms to React.Dispatch<SetStateAction<MaterialIssuesFormData>>
  const updateFormData = (value: React.SetStateAction<MaterialIssuesFormData>) => {
    // Handle both function and object updates
    setFormData(prev => {
      // If value is a function, call it with prev
      const updated = typeof value === 'function' ? value(prev) : value;
      
      // Compare with initialFormData to determine if we need saving
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
