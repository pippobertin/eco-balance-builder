
import { useState } from 'react';
import { StakeholdersFormData } from '../types';

export const useStakeholdersData = (reportId: string) => {
  const [formData, setFormData] = useState<StakeholdersFormData>({
    keyStakeholders: '',
    stakeholderEngagement: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  // Track initial data state to detect actual changes
  const [initialFormData, setInitialFormData] = useState<StakeholdersFormData>({
    keyStakeholders: '',
    stakeholderEngagement: ''
  });

  // Create a wrapper function that conforms to React.Dispatch<SetStateAction<StakeholdersFormData>>
  const updateFormData = (value: React.SetStateAction<StakeholdersFormData>) => {
    // Handle both function and object updates
    setFormData(prev => {
      // If value is a function, call it with prev
      const updated = typeof value === 'function' ? value(prev) : value;
      
      // Only set needsSaving if there's a difference between updated and initial data
      if (updated.keyStakeholders !== initialFormData.keyStakeholders || 
          updated.stakeholderEngagement !== initialFormData.stakeholderEngagement) {
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
