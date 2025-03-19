
import { useState, useEffect } from 'react';
import { useEmissionsLoad } from './useEmissionsLoad';
import { useEmissionsSave } from './useEmissionsSave';
import { EmissionsResults } from './types';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';

export const useEmissionsResults = (reportId: string | undefined) => {
  const [scope1Emissions, setScope1Emissions] = useState<number>(0);
  const [scope2Emissions, setScope2Emissions] = useState<number>(0);
  const [scope3Emissions, setScope3Emissions] = useState<number>(0);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);

  // Load hooks
  const { isLoading, loadEmissionsData, createInitialEmissionsData } = useEmissionsLoad(reportId);
  const { isSaving, saveEmissions } = useEmissionsSave();

  // Load existing emissions data when component mounts
  useEffect(() => {
    if (reportId) {
      loadEmissionsDataAndUpdate(reportId);
    }
  }, [reportId]);

  // Function to load and update emissions data
  const loadEmissionsDataAndUpdate = async (reportId: string) => {
    const data = await loadEmissionsData(reportId);
    
    if (data) {
      // Update local state with loaded data
      setScope1Emissions(Number(data.scope1_emissions) || 0);
      setScope2Emissions(Number(data.scope2_emissions) || 0);
      setScope3Emissions(Number(data.scope3_emissions) || 0);
      setTotalEmissions(Number(data.total_emissions) || 0);
    } else {
      // Initialize with zeros and create initial entry
      resetEmissions();
      await createInitialEmissionsData(reportId);
    }
  };

  // Function to save emissions with calculation logs
  const saveEmissionsWithLogs = async (
    reportId: string,
    scope1: number,
    scope2: number,
    scope3: number,
    calculationLogs: EmissionCalculationLogs
  ) => {
    if (!reportId) {
      console.error('Cannot save emissions: reportId is undefined');
      return null;
    }
    
    const result = await saveEmissions(reportId, scope1, scope2, scope3, calculationLogs);
    
    if (result) {
      // Update local state
      setScope1Emissions(result.scope1);
      setScope2Emissions(result.scope2);
      setScope3Emissions(result.scope3);
      setTotalEmissions(result.total);
      return result;
    }
    
    return null;
  };

  // Function to reset emissions data
  const resetEmissions = () => {
    setScope1Emissions(0);
    setScope2Emissions(0);
    setScope3Emissions(0);
    setTotalEmissions(0);
  };

  return {
    scope1Emissions,
    scope2Emissions,
    scope3Emissions,
    totalEmissions,
    isLoading,
    isSaving,
    saveEmissions: saveEmissionsWithLogs,
    resetEmissions
  };
};

// Re-export the hooks and types for easier access
export * from './types';
export * from './useEmissionsLoad';
export * from './useEmissionsSave';
