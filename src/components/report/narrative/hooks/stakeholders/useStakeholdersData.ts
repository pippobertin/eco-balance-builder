
import { useState } from 'react';
import { StakeholdersFormData } from '../types';

export const useStakeholdersData = (reportId: string) => {
  const [formData, setFormData] = useState<StakeholdersFormData>({
    keyStakeholders: '',
    stakeholderEngagement: ''
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
