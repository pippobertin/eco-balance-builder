
import { useState, useEffect } from 'react';
import { useEmissionsCalculator, EmissionsInput, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { safeJsonParse } from '@/integrations/supabase/client';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  onResetClick?: () => void
) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');
  const [calculatedEmissions, setCalculatedEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // Initialize logs from existing data if available
  const initialLogs = formValues?.environmentalMetrics?.emissionCalculationLogs
    ? safeJsonParse<EmissionCalculationLogs>(
        formValues.environmentalMetrics.emissionCalculationLogs,
        { scope1Calculations: [], scope2Calculations: [], scope3Calculations: [] }
      )
    : { scope1Calculations: [], scope2Calculations: [], scope3Calculations: [] };
  
  // Get emissions results hook
  const { 
    handleCalculationResults, 
    handleCalculationLogs, 
    calculationLogs, 
    setCalculationLogs,
    resetEmissionsValues 
  } = useEmissionsResults(setFormValues);
  
  // Initialize calculator with pre-loaded logs
  const {
    inputs,
    updateInput,
    results,
    calculateEmissions,
    resetCalculation,
    removeCalculation
  } = useEmissionsCalculator(
    undefined, 
    handleCalculationResults,
    handleCalculationLogs
  );
  
  // Initialize with existing logs if any
  useEffect(() => {
    if (initialLogs && 
        (initialLogs.scope1Calculations.length > 0 || 
         initialLogs.scope2Calculations.length > 0 || 
         initialLogs.scope3Calculations.length > 0)) {
      console.log("Setting initial calculation logs:", initialLogs);
      setCalculationLogs(initialLogs);
    }
  }, []);
  
  // Load existing emissions data if available
  useExistingEmissions(
    formValues,
    updateInput,
    resetCalculation,
    setCalculatedEmissions,
    setCalculationLogs
  );
  
  // Update handleRemoveCalculation to match expected signature
  const handleRemoveCalculation = (calculationId: string) => {
    // Call removeCalculation function with just the ID
    removeCalculation(calculationId);
  };
  
  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    calculationLogs,
    setCalculationLogs, // Make sure to return setCalculationLogs
    handleRemoveCalculation,
    resetCalculation: resetEmissionsValues
  };
};
