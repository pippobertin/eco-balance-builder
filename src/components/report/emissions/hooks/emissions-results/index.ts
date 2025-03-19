
import { useState, useEffect } from 'react';
import { useEmissionsLoad } from './useEmissionsLoad';
import { useEmissionsSave } from './useEmissionsSave';
import { EmissionsResults } from './types';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { useReport } from '@/hooks/use-report-context';

export const useEmissionsResults = (reportId: string | undefined) => {
  const { setNeedsSaving } = useReport();
  const [scope1Emissions, setScope1Emissions] = useState<number>(0);
  const [scope2Emissions, setScope2Emissions] = useState<number>(0);
  const [scope3Emissions, setScope3Emissions] = useState<number>(0);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load hooks
  const { isLoading, loadEmissionsData, createInitialEmissionsData } = useEmissionsLoad(reportId);
  const { isSaving, saveEmissions: saveEmissionsToDb } = useEmissionsSave();

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
      // Calculate totals from calculation_logs entries
      const calculationLogs = data.calculation_logs || { 
        scope1Calculations: [], 
        scope2Calculations: [], 
        scope3Calculations: [] 
      };
      
      // Sum up emissions from calculations
      const scope1 = calculationLogs.scope1Calculations?.reduce(
        (sum: number, calc: any) => sum + Number(calc.emissions || 0), 0) || 0;
      const scope2 = calculationLogs.scope2Calculations?.reduce(
        (sum: number, calc: any) => sum + Number(calc.emissions || 0), 0) || 0;
      const scope3 = calculationLogs.scope3Calculations?.reduce(
        (sum: number, calc: any) => sum + Number(calc.emissions || 0), 0) || 0;
      
      // Update local state with calculated totals
      setScope1Emissions(scope1);
      setScope2Emissions(scope2);
      setScope3Emissions(scope3);
      setTotalEmissions(scope1 + scope2 + scope3);
    } else {
      // Initialize with zeros and create initial entry
      resetEmissions();
      await createInitialEmissionsData(reportId);
    }
  };

  // Function to save emissions with calculation logs
  const saveEmissions = async (
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
    
    // Set needsSaving to true before saving
    setNeedsSaving(true);
    
    const result = await saveEmissionsToDb(reportId, scope1, scope2, scope3, calculationLogs);
    
    if (result) {
      // Update local state
      setScope1Emissions(result.scope1);
      setScope2Emissions(result.scope2);
      setScope3Emissions(result.scope3);
      setTotalEmissions(result.total);
      
      // Update local state
      setNeedsSaving(false);
      setLastSaved(new Date());
      
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
    saveEmissions,
    resetEmissions,
    lastSaved
  };
};

// Re-export the hooks and types for easier access
export * from './types';
export * from './useEmissionsLoad';
export * from './useEmissionsSave';
