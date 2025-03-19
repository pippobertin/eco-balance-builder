
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
    try {
      console.log('Performing emissions calculation for scope:', scope || 'all');
      console.log('Calculation inputs:', inputs);
      
      const result = performEmissionsCalculation(inputs, scope);
      console.log('Calculation result:', result);
      
      // Ensure the result is properly structured and has numeric values
      const validatedResult = {
        results: {
          scope1: typeof result.results.scope1 === 'number' ? result.results.scope1 : 0,
          scope2: typeof result.results.scope2 === 'number' ? result.results.scope2 : 0,
          scope3: typeof result.results.scope3 === 'number' ? result.results.scope3 : 0,
          total: typeof result.results.total === 'number' ? result.results.total : 0
        },
        details: {
          scope1Details: result.details.scope1Details || '',
          scope2Details: result.details.scope2Details || '',
          scope3Details: result.details.scope3Details || ''
        }
      };
      
      return validatedResult;
    } catch (error) {
      console.error('Error in emissions calculation:', error);
      // Return a safe fallback result
      return {
        results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        details: { 
          scope1Details: 'Error in calculation', 
          scope2Details: 'Error in calculation', 
          scope3Details: 'Error in calculation' 
        }
      };
    }
  }, []);
  
  return {
    performCalculation
  };
};
