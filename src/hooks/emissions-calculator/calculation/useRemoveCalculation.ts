
import { useCallback } from 'react';
import { 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';
import { useEmissionsRecords } from '../useEmissionsRecords';

/**
 * Hook for removing calculations
 */
export const useRemoveCalculation = (
  details: EmissionsDetails,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  setResults: (results: any) => void,
  onResultsChange?: (results: any, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  // Get record management
  const { 
    calculateTotalsFromLogs,
    removeRecord
  } = useEmissionsRecords();
  
  /**
   * Remove a specific calculation by ID
   */
  const removeCalculation = useCallback((calculationId: string) => {
    console.log("Removing calculation in emissions hook:", calculationId);
    
    setCalculationLogs(prev => {
      // Find which scope contains this calculation
      let targetScope: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
      
      // Check each scope for the calculation ID
      for (const scope of ['scope1Calculations', 'scope2Calculations', 'scope3Calculations'] as const) {
        if (prev[scope].some(calc => calc.id === calculationId)) {
          targetScope = scope;
          break;
        }
      }
      
      if (!targetScope) {
        console.error("Target scope not found for ID:", calculationId);
        console.log("Available calculations:", JSON.stringify(prev));
        return prev;
      }
      
      console.log(`Found calculation to remove in ${targetScope}`);
      
      // Remove the record from logs
      const updatedLogs = removeRecord(prev, targetScope, calculationId);
      
      // Calculate new totals from updated logs
      const updatedResults = calculateTotalsFromLogs(updatedLogs);
      
      // Update results state
      setResults(updatedResults);
      
      // Call callbacks
      if (onCalculationLogChange) {
        onCalculationLogChange(updatedLogs);
      }
      
      if (onResultsChange) {
        onResultsChange(updatedResults, details);
      }
      
      return updatedLogs;
    });
  }, [
    setCalculationLogs, 
    setResults, 
    removeRecord, 
    calculateTotalsFromLogs, 
    details, 
    onCalculationLogChange, 
    onResultsChange
  ]);
  
  return {
    removeCalculation
  };
};
