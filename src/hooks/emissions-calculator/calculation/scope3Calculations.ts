
import { EmissionsInput, EmissionsResults } from '../types';
import { performTransportCalculation } from './scope3/transportCalculations';
import { performWasteCalculation } from './scope3/wasteCalculations';
import { performPurchaseCalculation } from './scope3/purchaseCalculations';

/**
 * Perform Scope 3 emissions calculation
 */
export const performScope3Calculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  // Determine which category of Scope 3 we're calculating
  const category = inputs.scope3Category || 'transport';
  
  console.log('Performing Scope 3 calculation for category:', category, 'with initial results:', results);
  
  let calculationResult;
  if (category === 'transport') {
    calculationResult = performTransportCalculation(inputs, results);
  } else if (category === 'waste') {
    calculationResult = performWasteCalculation(inputs, results);
  } else if (category === 'purchases') {
    calculationResult = performPurchaseCalculation(inputs, results);
  } else {
    // Default return if no category matched
    return { updatedResults: results, details: '' };
  }
  
  console.log('Scope 3 calculation completed. Updated results:', calculationResult.updatedResults);
  return calculationResult;
};

// Re-export the specific calculation functions for direct use
export { 
  performTransportCalculation,
  performWasteCalculation,
  performPurchaseCalculation 
};
