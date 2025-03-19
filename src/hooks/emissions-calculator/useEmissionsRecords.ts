
import { useCallback } from 'react';
import { EmissionCalculationRecord, EmissionCalculationLogs, EmissionsResults } from './types';

/**
 * Hook for managing emissions records
 */
export const useEmissionsRecords = () => {
  /**
   * Create a new calculation record
   */
  const createCalculationRecord = useCallback((
    id: string,
    scope: 'scope1' | 'scope2' | 'scope3',
    source: string,
    description: string,
    quantity: number,
    unit: string,
    emissions: number,
    details: any
  ): EmissionCalculationRecord => {
    return {
      id,
      date: new Date().toISOString(),
      scope,
      source,
      description,
      quantity,
      unit,
      emissions,
      details
    };
  }, []);
  
  /**
   * Calculate total emissions from logs
   */
  const calculateTotalsFromLogs = useCallback((logs: EmissionCalculationLogs): EmissionsResults => {
    // Calculate scope1 total
    const scope1Total = logs.scope1Calculations.reduce(
      (total, calc) => total + (typeof calc.emissions === 'number' ? calc.emissions : 0),
      0
    );
    
    // Calculate scope2 total
    const scope2Total = logs.scope2Calculations.reduce(
      (total, calc) => total + (typeof calc.emissions === 'number' ? calc.emissions : 0),
      0
    );
    
    // Calculate scope3 total
    const scope3Total = logs.scope3Calculations.reduce(
      (total, calc) => total + (typeof calc.emissions === 'number' ? calc.emissions : 0),
      0
    );
    
    // Calculate grand total
    const total = scope1Total + scope2Total + scope3Total;
    
    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total
    };
  }, []);
  
  /**
   * Remove a record from calculation logs
   */
  const removeRecord = useCallback((
    logs: EmissionCalculationLogs,
    scopeKey: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations',
    calculationId: string
  ): EmissionCalculationLogs => {
    // Create a new logs object with the calculation removed
    return {
      ...logs,
      [scopeKey]: logs[scopeKey].filter(calc => calc.id !== calculationId)
    };
  }, []);
  
  return { createCalculationRecord, calculateTotalsFromLogs, removeRecord };
};
