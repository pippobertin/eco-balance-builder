
import { useState } from 'react';
import { GovernanceFormData, SectionHookResult } from '../types';

export const useGovernanceData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<GovernanceFormData>({
    sustainabilityGovernance: ''
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
