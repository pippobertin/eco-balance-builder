
import { useCallback } from 'react';
import { EmissionCalculationLogs, EmissionsResults } from '../types';

/**
 * Hook for removing a calculation from the logs
 */
export const useRemoveCalculation = () => {
  /**
   * Remove a calculation from logs and update totals
   */
  const removeCalculation = useCallback((
    calculationId: string,
    calculationLogs: EmissionCalculationLogs
  ): {
    updatedLogs: EmissionCalculationLogs;
    updatedResults: EmissionsResults;
  } => {
    console.log('useRemoveCalculation: Removing calculation with ID:', calculationId);
    
    // Create a deep copy of logs to avoid mutation issues
    const updatedLogs: EmissionCalculationLogs = {
      scope1Calculations: calculationLogs.scope1Calculations.filter(calc => calc.id !== calculationId),
      scope2Calculations: calculationLogs.scope2Calculations.filter(calc => calc.id !== calculationId),
      scope3Calculations: calculationLogs.scope3Calculations.filter(calc => calc.id !== calculationId)
    };
    
    // Recalculate totals
    const scope1Total = updatedLogs.scope1Calculations.reduce((sum, calc) => sum + (calc.emissions || 0), 0);
    const scope2Total = updatedLogs.scope2Calculations.reduce((sum, calc) => sum + (calc.emissions || 0), 0);
    const scope3Total = updatedLogs.scope3Calculations.reduce((sum, calc) => sum + (calc.emissions || 0), 0);
    
    const updatedResults: EmissionsResults = {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total: scope1Total + scope2Total + scope3Total
    };
    
    console.log('useRemoveCalculation: Updated logs:', updatedLogs);
    console.log('useRemoveCalculation: Updated results:', updatedResults);
    
    return { updatedLogs, updatedResults };
  }, []);
  
  return { removeCalculation };
};
