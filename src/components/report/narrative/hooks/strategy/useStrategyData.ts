
import { useState } from 'react';
import { StrategyFormData } from '../types';

export const useStrategyData = (reportId: string) => {
  const [formData, setFormData] = useState<StrategyFormData>({
    productsServices: '',
    markets: '',
    businessRelations: '',
    sustainabilityStrategy: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
