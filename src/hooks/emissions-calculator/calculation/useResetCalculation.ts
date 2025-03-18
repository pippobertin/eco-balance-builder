
import { useCallback } from 'react';
import { 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';

/**
 * Hook for resetting calculations
 */
export const useResetCalculation = (
  resetInputs: () => void,
  setResults: (results: EmissionsResults) => void,
  setDetails: (details: EmissionsDetails) => void,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  /**
   * Reset calculation
   */
  const resetCalculation = useCallback(() => {
    // Reset calculation logs
    const newLogs = {
      scope1Calculations: [],
      scope2Calculations: [],
      scope3Calculations: []
    };
    
    // Reset results based on empty logs
    const newResults = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    };
    
    // Reset details
    const newDetails = {
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    };
    
    // Update state
    setResults(newResults);
    setDetails(newDetails);
    setCalculationLogs(newLogs);
    
    // Reset input fields that contain quantities
    resetInputs();
    
    // Call callbacks if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    if (onCalculationLogChange) {
      onCalculationLogChange(newLogs);
    }
    
    return { results: newResults, details: newDetails };
  }, [resetInputs, setResults, setDetails, setCalculationLogs, onResultsChange, onCalculationLogChange]);
  
  return {
    resetCalculation
  };
};
