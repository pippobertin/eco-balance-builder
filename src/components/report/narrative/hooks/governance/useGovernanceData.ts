
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

  // Create a wrapper function that conforms to React.Dispatch<SetStateAction<GovernanceFormData>>
  const updateFormData = (value: React.SetStateAction<GovernanceFormData>) => {
    // Handle both function and object updates
    setFormData(prev => {
      // If value is a function, call it with prev
      const updated = typeof value === 'function' ? value(prev) : value;
      
      // Compare with initialFormData to determine if we need saving
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
