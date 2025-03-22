
import { useState, useEffect } from 'react';
import { StrategyFormData } from '../types';
import { useReport } from '@/context/ReportContext';
import { useStrategyLoad } from './useStrategyLoad';
import { useStrategySave } from './useStrategySave';

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
  const { setNeedsSaving } = useReport();
  
  // Load data
  useStrategyLoad(reportId, setFormData, setIsLoading);
  
  // Get save function
  const { saveData } = useStrategySave(reportId, formData, setIsSaving, setLastSaved);

  // Monitor changes to formData to set needsSaving flag
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading, setNeedsSaving]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    lastSaved,
    setLastSaved,
    saveData
  };
};
