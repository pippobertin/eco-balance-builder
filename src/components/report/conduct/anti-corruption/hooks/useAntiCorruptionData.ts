
import { useEffect } from 'react';
import { useAntiCorruptionLoad } from './useAntiCorruptionLoad';
import { useAntiCorruptionSave } from './useAntiCorruptionSave';
import { AntiCorruptionData } from './types';

export const useAntiCorruptionData = (reportId: string | undefined) => {
  const {
    loading,
    antiCorruptionData,
    setAntiCorruptionData,
    loadAntiCorruptionData
  } = useAntiCorruptionLoad(reportId);

  const {
    isSaving,
    lastSaved,
    saveAntiCorruptionData
  } = useAntiCorruptionSave(reportId, setAntiCorruptionData);

  // Load data when reportId changes
  useEffect(() => {
    if (reportId) {
      loadAntiCorruptionData();
    }
  }, [reportId, loadAntiCorruptionData]);

  return {
    loading,
    antiCorruptionData,
    saveAntiCorruptionData,
    isSaving,
    lastSaved
  };
};
