
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { performEmissionsCalculation } from './calculation/performCalculation';

/**
 * Hook that provides calculation functionality without state management
 * This is a simpler hook that can be used by other components without introducing
 * circular dependencies or requiring state management
 */
export const useEmissionsCalculations = () => {
  // Simple function to calculate emissions based on inputs and scope
  const performCalculation = (
    inputs: EmissionsInput,
    scope?: 'scope1' | 'scope2' | 'scope3'
  ): { results: EmissionsResults; details: EmissionsDetails } => {
    console.log('Performing emissions calculation with inputs:', JSON.stringify(inputs), 'for scope:', scope);
    
    // Validate inputs before calculation
    if (!inputs) {
      console.error('Invalid inputs for calculation:', inputs);
      return {
        results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        details: { scope1Details: {}, scope2Details: {}, scope3Details: {} }
      };
    }
    
    try {
      // Call the calculation function
      const calculationResult = performEmissionsCalculation(inputs, scope);
      console.log('Calculation result:', JSON.stringify(calculationResult));
      
      // Ensure the calculation result has the expected structure
      if (!calculationResult.results) {
        console.error('Invalid calculation result structure:', calculationResult);
        return {
          results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
          details: { scope1Details: {}, scope2Details: {}, scope3Details: {} }
        };
      }
      
      return calculationResult;
    } catch (error) {
      console.error('Error during emissions calculation:', error);
      return {
        results: { scope1: 0, scope2: 0, scope3: 0, total: 0 },
        details: { scope1Details: {}, scope2Details: {}, scope3Details: {} }
      };
    }
  };
  
  return { performCalculation };
};
