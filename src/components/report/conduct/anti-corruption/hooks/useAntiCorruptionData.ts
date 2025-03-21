
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

  // Load data when reportId changes or on component mount
  useEffect(() => {
    if (reportId) {
      console.log("Loading anti-corruption data for report ID:", reportId);
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
