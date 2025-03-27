
import { useState } from 'react';
import { GovernanceFormData } from '../types';

export const useGovernanceData = (reportId: string) => {
  const [formData, setFormData] = useState<GovernanceFormData>({
    sustainabilityGovernance: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  // Track initial data state to detect actual changes
  const [initialFormData, setInitialFormData] = useState<GovernanceFormData>({
    sustainabilityGovernance: ''
  });

  // Update formData with setter that tracks changes against initialFormData
  const updateFormData = (newData: Partial<GovernanceFormData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Only set needsSaving if there's a difference between updated and initial data
      if (updated.sustainabilityGovernance !== initialFormData.sustainabilityGovernance) {
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
