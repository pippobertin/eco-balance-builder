
import { useEffect } from 'react';
import { useWorkforceSafetyLoad } from './useWorkforceSafetyLoad';
import { useWorkforceSafetySave } from './useWorkforceSafetySave';
import { useWorkforceSafetyCalculation } from './useWorkforceSafetyCalculation';
import { WorkforceSafetyData } from './types';

export const useWorkforceSafetyData = (reportId: string | undefined) => {
  const { loading, safetyData, setSafetyData, loadSafetyData } = useWorkforceSafetyLoad(reportId);
  const { isSaving, lastSaved, saveSafetyData } = useWorkforceSafetySave(reportId, setSafetyData);
  const { calculateAccidentsRate } = useWorkforceSafetyCalculation();

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading workforce safety data on mount for report:", reportId);
      loadSafetyData();
    }
  }, [reportId, loadSafetyData]);

  return {
    loading,
    safetyData,
    loadSafetyData,
    saveSafetyData,
    calculateAccidentsRate,
    isSaving,
    lastSaved
  };
};
