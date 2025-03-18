
import { useCallback } from 'react';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { performEmissionsCalculation } from './calculations';

/**
 * Hook for emissions calculation logic
 */
export const useEmissionsCalculations = () => {
  /**
   * Performs the emissions calculation based on inputs
   */
  const performCalculation = useCallback((
    inputs: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ): { results: EmissionsResults; details: EmissionsDetails } => {
    return performEmissionsCalculation(inputs, scope);
  }, []);
  
  return {
    performCalculation
  };
};
