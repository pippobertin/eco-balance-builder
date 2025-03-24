
import { useState } from 'react';
import { StakeholdersFormData, SectionHookResult } from '../types';

export const useStakeholdersData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<StakeholdersFormData>({
    keyStakeholders: '',
    stakeholderEngagement: ''
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
