
import { useState } from 'react';
import { IssuesManagementFormData, SectionHookResult } from '../types';

export const useIssuesManagementData = (reportId: string): SectionHookResult<IssuesManagementFormData> => {
  const [formData, setFormData] = useState<IssuesManagementFormData>({
    policiesActions: '',
    policiesDescription: '',
    actionsDescription: '',
    energyEfficiencyActions: '',
    stakeholdersImpacts: '',
    antiCorruptionMeasures: ''
  });
  const [initialFormData, setInitialFormData] = useState<IssuesManagementFormData>({
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
