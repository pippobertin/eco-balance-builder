
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
    console.log('Performing emissions calculation with inputs:', inputs, 'for scope:', scope);
    const calculationResult = performEmissionsCalculation(inputs, scope);
    console.log('Calculation result:', calculationResult);
    return calculationResult;
  };
  
  return { performCalculation };
};
