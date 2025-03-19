
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
  
  if (category === 'transport') {
    return performTransportCalculation(inputs, results);
  } else if (category === 'waste') {
    return performWasteCalculation(inputs, results);
  } else if (category === 'purchases') {
    return performPurchaseCalculation(inputs, results);
  }
  
  // Default return if no calculations performed
  return { updatedResults: results, details: '' };
};

// Re-export the specific calculation functions for direct use
export { 
  performTransportCalculation,
  performWasteCalculation,
  performPurchaseCalculation 
};
