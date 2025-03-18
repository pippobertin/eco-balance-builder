
import { useCallback } from 'react';
import { useEmissionsCalculatorState } from './useEmissionsCalculatorState';
import { useEmissionsCalculations } from './useEmissionsCalculations';
import { useEmissionsRecords } from './useEmissionsRecords';
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
  
  // Get record management
  const { 
    createCalculationRecord,
    calculateTotalsFromLogs,
    removeRecord 
  } = useEmissionsRecords();
  
  // Get calculation functionality
  const { performCalculation } = useEmissionsCalculations();
  
  // Calculation function
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
    
    // Update results state
    setResults(updatedResults);
    
    // Update details state
    setDetails(prev => ({
      scope1Details: scope === 'scope1' ? newDetails.scope1Details : prev.scope1Details,
      scope2Details: scope === 'scope2' ? newDetails.scope2Details : prev.scope2Details,
      scope3Details: scope === 'scope3' ? newDetails.scope3Details : prev.scope3Details
    }));
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(updatedResults, newDetails);
    }
    
    return { results: updatedResults, details: newDetails };
  }, [inputs, calculationLogs, performCalculation, createCalculationRecord, calculateTotalsFromLogs, setCalculationLogs, setResults, setDetails, onCalculationLogChange, onResultsChange]);
  
  // Reset calculation
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
  
  // Function to remove a specific calculation - simplified to only require calculationId
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
  }, [setCalculationLogs, setResults, removeRecord, calculateTotalsFromLogs, details, onCalculationLogChange, onResultsChange]);
  
  return {
    inputs,
    updateInput,
    results,
    details,
    calculationLogs,
    calculateEmissions,
    resetCalculation,
    removeCalculation
  };
};
