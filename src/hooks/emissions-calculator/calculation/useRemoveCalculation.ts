
import { useCallback } from 'react';
import { EmissionCalculationLogs } from '../types';
import { useEmissionsRecords } from '../useEmissionsRecords';

/**
 * Hook for removing calculations from logs
 */
export const useRemoveCalculation = () => {
  const { removeRecord, calculateTotalsFromLogs } = useEmissionsRecords();
  
  /**
   * Remove a calculation from logs and recalculate totals
   */
  const removeCalculation = useCallback((
    calculationId: string,
    logs: EmissionCalculationLogs
  ): { updatedLogs: EmissionCalculationLogs; updatedResults: any } => {
    console.log('Removing calculation:', calculationId);
    
    // Check each scope for the calculation ID
    let scopeKey: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
    
    if (logs.scope1Calculations.some(calc => calc.id === calculationId)) {
      scopeKey = 'scope1Calculations';
    } else if (logs.scope2Calculations.some(calc => calc.id === calculationId)) {
      scopeKey = 'scope2Calculations';
    } else if (logs.scope3Calculations.some(calc => calc.id === calculationId)) {
      scopeKey = 'scope3Calculations';
    }
    
    if (!scopeKey) {
      console.error('Calculation not found:', calculationId);
      return { updatedLogs: logs, updatedResults: calculateTotalsFromLogs(logs) };
    }
    
    // Remove the calculation record
    const updatedLogs = removeRecord(logs, scopeKey, calculationId);
    
    // Calculate updated totals
    const updatedResults = calculateTotalsFromLogs(updatedLogs);
    
    return { updatedLogs, updatedResults };
  }, [removeRecord, calculateTotalsFromLogs]);
  
  return { removeCalculation };
};
