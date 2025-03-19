
import { useCallback } from 'react';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { performEmissionsCalculation } from './calculation/performCalculation';

/**
 * Hook for emissions calculation logic
 */
export const useEmissionsCalculations = () => {
  /**
   * Performs the emissions calculation based on inputs
   * @param inputs - User inputs for the calculation
   * @param scope - Optional scope to limit calculation to (scope1, scope2, or scope3)
   * @returns Object containing results and details of the calculation
   */
  const performCalculation = useCallback((
    inputs: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ): { results: EmissionsResults; details: EmissionsDetails } => {
    console.log('Performing emissions calculation for scope:', scope || 'all');
    console.log('Calculation inputs:', inputs);
    
    const result = performEmissionsCalculation(inputs, scope);
    console.log('Calculation result:', result);
    
    return result;
  }, []);
  
  return {
    performCalculation
  };
};
