
import { useState } from 'react';
import { GovernanceFormData } from '../types';

export const useGovernanceData = (reportId: string) => {
  const [formData, setFormData] = useState<GovernanceFormData>({
    sustainabilityGovernance: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving
  };
};
