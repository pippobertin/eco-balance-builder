
import { useState, useEffect } from 'react';
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

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading anti-corruption data on mount for report:", reportId);
      loadAntiCorruptionData();
    }
  }, [reportId, loadAntiCorruptionData]);

  return {
    loading,
    antiCorruptionData,
    loadAntiCorruptionData,
    saveAntiCorruptionData,
    isSaving,
    lastSaved
  };
};
