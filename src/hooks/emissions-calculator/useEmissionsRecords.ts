
import { useCallback } from 'react';
import { 
  EmissionCalculationRecord,
  EmissionCalculationLogs,
  EmissionsResults
} from './types';

/**
 * Hook for managing emissions calculation records
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
   * Calculate total emissions from calculation logs
   */
  const calculateTotalsFromLogs = useCallback((logs: EmissionCalculationLogs): EmissionsResults => {
    const scope1Total = logs.scope1Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope2Total = logs.scope2Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope3Total = logs.scope3Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const total = scope1Total + scope2Total + scope3Total;
    
    return {
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total
    };
  }, []);
  
  return {
    createCalculationRecord,
    calculateTotalsFromLogs
  };
};
