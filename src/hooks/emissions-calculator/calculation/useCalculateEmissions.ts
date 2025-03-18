
import { useCallback } from 'react';
import { 
  EmissionsInput, 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';
import { useEmissionsRecords } from '../useEmissionsRecords';
import { useCalculationProcessor } from './useCalculationProcessor';

/**
 * Hook for calculating emissions
 */
export const useCalculateEmissions = (
  inputs: EmissionsInput,
  calculationLogs: EmissionCalculationLogs,
  setResults: (results: EmissionsResults) => void,
  setDetails: (details: EmissionsDetails) => void,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void,
  onCalculationLogChange?: (logs: EmissionCalculationLogs) => void
) => {
  // Get record management
  const { 
    createCalculationRecord,
    calculateTotalsFromLogs
  } = useEmissionsRecords();
  
  // Get calculation processor with fixed parameter order
  const { 
    performCalculation,
    processCalculationResults
  } = useCalculationProcessor(
    setResults,
    setDetails,
    setCalculationLogs,
    onResultsChange,
    onCalculationLogChange
  );
  
  /**
   * Calculate emissions for a specific scope
   */
  const calculateEmissions = useCallback((scope?: 'scope1' | 'scope2' | 'scope3') => {
    const { results: newResults, details: newDetails } = performCalculation(inputs, scope);
    
    // Create updated logs
    let updatedLogs = { ...calculationLogs };
    
    // Update calculation logs if we have a new calculation
    if (scope) {
      // Create a record only if there are calculated emissions
      const emissionValue = scope === 'scope1' ? newResults.scope1 : 
                          scope === 'scope2' ? newResults.scope2 : newResults.scope3;
      
      if (emissionValue > 0) {
        const detailsObj = scope === 'scope1' ? JSON.parse(newDetails.scope1Details || '{}') : 
                          scope === 'scope2' ? JSON.parse(newDetails.scope2Details || '{}') : 
                          JSON.parse(newDetails.scope3Details || '{}');
        
        const newRecord = createCalculationRecord(
          scope, 
          inputs,
          emissionValue,
          detailsObj
        );
        
        updatedLogs = { ...calculationLogs };
        if (scope === 'scope1') {
          updatedLogs.scope1Calculations = [...calculationLogs.scope1Calculations, newRecord];
        } else if (scope === 'scope2') {
          updatedLogs.scope2Calculations = [...calculationLogs.scope2Calculations, newRecord];
        } else if (scope === 'scope3') {
          updatedLogs.scope3Calculations = [...calculationLogs.scope3Calculations, newRecord];
        }
        
        // Update calculation logs
        setCalculationLogs(updatedLogs);
        
        // Callback for log changes
        if (onCalculationLogChange) {
          onCalculationLogChange(updatedLogs);
        }
      }
    }
    
    // Calculate new totals from logs
    const updatedResults = calculateTotalsFromLogs(updatedLogs);
    
    // Process calculation results
    return processCalculationResults(updatedResults, newDetails, updatedLogs);
  }, [
    inputs, 
    calculationLogs, 
    performCalculation, 
    createCalculationRecord, 
    calculateTotalsFromLogs, 
    setCalculationLogs, 
    onCalculationLogChange, 
    processCalculationResults
  ]);
  
  return {
    calculateEmissions
  };
};
