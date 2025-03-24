
import { useState } from 'react';
import { IssuesManagementFormData, SectionHookResult } from '../types';

export const useIssuesManagementData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<IssuesManagementFormData>({
    policiesActions: '',
    policiesDescription: '',
    actionsDescription: '',
    energyEfficiencyActions: '',
    stakeholdersImpacts: '',
    antiCorruptionMeasures: ''
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
