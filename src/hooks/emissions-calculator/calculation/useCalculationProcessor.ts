
import { useCallback } from 'react';
import { 
  EmissionsInput, 
  EmissionsResults, 
  EmissionsDetails, 
  EmissionCalculationLogs 
} from '../types';
import { performEmissionsCalculation } from './performCalculation';

/**
 * Hook specifically for processing emission calculations
 */
export const useCalculationProcessor = () => {
  /**
   * Process a calculation for a specific scope
   */
  const processCalculation = useCallback((
    inputs: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ): { results: EmissionsResults; details: EmissionsDetails } => {
    return performEmissionsCalculation(inputs, scope);
  }, []);
  
  return {
    processCalculation
  };
};
