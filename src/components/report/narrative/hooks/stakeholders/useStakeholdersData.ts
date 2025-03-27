
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

  // Update formData with setter that tracks changes against initialFormData
  const updateFormData = (newData: Partial<StakeholdersFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
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
