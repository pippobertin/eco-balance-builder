
import { useEmissionsCalculatorState } from './useEmissionsCalculatorState';
import { useCalculateEmissions } from './calculation/useCalculateEmissions';
import { useResetCalculation } from './calculation/useResetCalculation';
import { useRemoveCalculation } from './calculation/useRemoveCalculation';
import { EmissionsInput, EmissionsResults, EmissionsDetails, EmissionCalculationLogs } from './types';

/**
 * Main emissions calculator hook that combines other specialized hooks
 */
export const useEmissionsCalculator = (
  initialInputs?: EmissionsInput,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
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
  
  // Get calculation functionality
  const { calculateEmissions } = useCalculateEmissions(
    inputs,
    calculationLogs,
    setResults,
    setDetails,
    setCalculationLogs,
    onResultsChange,
    onCalculationLogChange
  );
  
  // Get reset functionality
  const { resetCalculation } = useResetCalculation(
    resetInputs,
    setResults,
    setDetails,
    setCalculationLogs,
    onResultsChange,
    onCalculationLogChange
  );
  
  // Get remove calculation functionality
  // No arguments needed for the hook itself
  const { removeCalculation } = useRemoveCalculation();
  
  // Wrapper function to handle removing a calculation
  const handleRemoveCalculation = (calculationId: string) => {
    const { updatedLogs, updatedResults } = removeCalculation(calculationId, calculationLogs);
    
    // Update state
    setCalculationLogs(updatedLogs);
    setResults(updatedResults);
    
    // Call callbacks
    if (onResultsChange) {
      onResultsChange(updatedResults, details);
    }
    
    if (onCalculationLogChange) {
      onCalculationLogChange(updatedLogs);
    }
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
