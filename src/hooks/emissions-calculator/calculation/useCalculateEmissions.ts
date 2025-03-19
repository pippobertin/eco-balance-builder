
import { useCallback } from 'react';
import { 
  EmissionsInput, 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';
import { useEmissionsRecords } from '../useEmissionsRecords';
import { useCalculationProcessor } from './useCalculationProcessor';
import { performEmissionsCalculation } from './performCalculation';

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
  
  /**
   * Calculate emissions for a specific scope
   */
  const calculateEmissions = useCallback((scope?: 'scope1' | 'scope2' | 'scope3') => {
    console.log('Starting calculation for scope:', scope);
    console.log('Current inputs:', JSON.stringify(inputs));
    
    // Perform the calculation using the performEmissionsCalculation function
    const { results: newResults, details: newDetails } = performEmissionsCalculation(inputs, scope);
    console.log('Calculation results:', newResults);
    console.log('Calculation details:', newDetails);
    
    // Create updated logs
    let updatedLogs = { ...calculationLogs };
    
    // Update calculation logs if we have a new calculation
    if (scope) {
      // Create a record only if there are calculated emissions
      const emissionValue = scope === 'scope1' ? newResults.scope1 : 
                          scope === 'scope2' ? newResults.scope2 : newResults.scope3;
      
      if (emissionValue > 0) {
        console.log(`Found positive emissions for ${scope}:`, emissionValue);
        
        const detailsObj = scope === 'scope1' ? 
                          (newDetails.scope1Details ? JSON.parse(newDetails.scope1Details) : {}) : 
                          scope === 'scope2' ? 
                          (newDetails.scope2Details ? JSON.parse(newDetails.scope2Details) : {}) : 
                          (newDetails.scope3Details ? JSON.parse(newDetails.scope3Details) : {});
        
        const newRecord = createCalculationRecord(
          scope, 
          inputs,
          emissionValue,
          detailsObj
        );
        
        console.log('Created new calculation record:', newRecord);
        
        updatedLogs = { ...calculationLogs };
        if (scope === 'scope1') {
          updatedLogs.scope1Calculations = [...(Array.isArray(calculationLogs.scope1Calculations) ? calculationLogs.scope1Calculations : []), newRecord];
        } else if (scope === 'scope2') {
          updatedLogs.scope2Calculations = [...(Array.isArray(calculationLogs.scope2Calculations) ? calculationLogs.scope2Calculations : []), newRecord];
        } else if (scope === 'scope3') {
          updatedLogs.scope3Calculations = [...(Array.isArray(calculationLogs.scope3Calculations) ? calculationLogs.scope3Calculations : []), newRecord];
        }
        
        // Update calculation logs
        setCalculationLogs(updatedLogs);
        console.log('Updated calculation logs:', updatedLogs);
        
        // Callback for log changes
        if (onCalculationLogChange) {
          onCalculationLogChange(updatedLogs);
        }
      } else {
        console.warn(`No emissions calculated for ${scope}, value:`, emissionValue);
      }
    }
    
    // Update results
    setResults(newResults);
    
    // Update details
    setDetails(newDetails);
    
    // Callback for results changes
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  }, [
    inputs, 
    calculationLogs, 
    createCalculationRecord, 
    setCalculationLogs, 
    onCalculationLogChange,
    setResults,
    setDetails,
    onResultsChange
  ]);
  
  return {
    calculateEmissions
  };
};
