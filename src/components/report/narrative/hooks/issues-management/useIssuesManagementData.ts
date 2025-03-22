
import { useState } from 'react';
import { IssuesManagementFormData } from '../types';

export const useIssuesManagementData = (reportId: string) => {
  const [formData, setFormData] = useState<IssuesManagementFormData>({
    policiesActions: '',
    policiesDescription: '',
    actionsDescription: '',
    energyEfficiencyActions: '',
    stakeholdersImpacts: '',
    antiCorruptionMeasures: ''
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
