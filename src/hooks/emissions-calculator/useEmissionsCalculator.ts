
import { useEmissionsCalculatorState } from './useEmissionsCalculatorState';
import { useCalculateEmissions } from './calculation/useCalculateEmissions';
import { useResetCalculation } from './calculation/useResetCalculation';
import { useRemoveCalculation } from './calculation/useRemoveCalculation';
import { EmissionsInput, EmissionsResults, EmissionsDetails, EmissionCalculationLogs } from './types';
import { useEmissionsCalculations } from './useEmissionsCalculations';

/**
 * Main emissions calculator hook that combines other specialized hooks
 */
export const useEmissionsCalculator = (
  initialInputs?: EmissionsInput,
) => {
  // Get state management
  const {
    inputs,
    updateInput,
    resetInputs,
    results,
    setResults,
    details,
    setDetails,
    calculationLogs,
    setCalculationLogs
  } = useEmissionsCalculatorState(initialInputs);
  
  // Get calculation functionality using the standalone hook
  const { performCalculation } = useEmissionsCalculations();
  
  // Get reset functionality
  const { resetCalculation } = useResetCalculation(
    resetInputs,
    setResults,
    setDetails,
    setCalculationLogs
  );
  
  // Get remove calculation functionality
  const { removeCalculation } = useRemoveCalculation();
  
  // Wrapper function to handle removing a calculation
  const handleRemoveCalculation = (calculationId: string) => {
    const { updatedLogs, updatedResults } = removeCalculation(calculationId, calculationLogs);
    
    // Update state
    setCalculationLogs(updatedLogs);
    setResults(updatedResults);
  };
  
  // Function to calculate emissions
  const calculateEmissions = (
    inputValues: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ) => {
    return performCalculation(inputValues, scope);
  };
  
  return {
    inputs,
    updateInput,
    results,
    details,
    calculationLogs,
    calculateEmissions,
    resetCalculation,
    removeCalculation: handleRemoveCalculation
  };
};
