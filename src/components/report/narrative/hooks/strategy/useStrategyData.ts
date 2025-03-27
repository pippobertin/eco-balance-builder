
import { useState } from 'react';
import { StrategyFormData, SectionHookResult } from '../types';

export const useStrategyData = (reportId: string): SectionHookResult<StrategyFormData> => {
  const [formData, setFormData] = useState<StrategyFormData>({
    productsServices: '',
    markets: '',
    businessRelations: '',
    sustainabilityStrategy: ''
  });
  const [initialFormData, setInitialFormData] = useState<StrategyFormData>({
    productsServices: '',
    markets: '',
    businessRelations: '',
    sustainabilityStrategy: ''
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
