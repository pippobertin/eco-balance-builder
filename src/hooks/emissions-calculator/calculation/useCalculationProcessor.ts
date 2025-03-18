
import { useCallback } from 'react';
import { 
  EmissionsInput, 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';
import { useEmissionsCalculations } from '../useEmissionsCalculations';

/**
 * Hook specifically for processing emission calculations
 */
export const useCalculationProcessor = (
  setResults: (results: EmissionsResults) => void,
  setDetails: (details: EmissionsDetails) => void,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  // Get calculation functionality
  const { performCalculation } = useEmissionsCalculations();
  
  /**
   * Process calculation results and update state
   */
  const processCalculationResults = useCallback(
    (newResults: EmissionsResults, newDetails: EmissionsDetails, updatedLogs: EmissionCalculationLogs) => {
      // Update results state
      setResults(newResults);
      
      // Update details state
      setDetails(newDetails);
      
      // Update calculation logs
      setCalculationLogs(updatedLogs);
      
      // Call callbacks if provided
      if (onResultsChange) {
        onResultsChange(newResults, newDetails);
      }
      
      if (onCalculationLogChange) {
        onCalculationLogChange(updatedLogs);
      }
      
      return { results: newResults, details: newDetails };
    },
    [setResults, setDetails, setCalculationLogs, onResultsChange, onCalculationLogChange]
  );
  
  return {
    performCalculation,
    processCalculationResults
  };
};
