
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../types';
import { performTransportCalculation } from './scope3/transportCalculations';
import { performWasteCalculation } from './scope3/wasteCalculations';
import { performPurchaseCalculation } from './scope3/purchaseCalculations';

// Re-export the scope3 calculation functions for use in index.ts
export { performTransportCalculation };
export { performWasteCalculation };
export { performPurchaseCalculation };

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
  console.log('Starting scope3 calculation with inputs:', {
    scope3Category: inputs.scope3Category,
    transportType: inputs.transportType,
    transportDistance: inputs.transportDistance,
    wasteType: inputs.wasteType,
    wasteQuantity: inputs.wasteQuantity,
    purchaseType: inputs.purchaseType,
    purchaseQuantity: inputs.purchaseQuantity,
    reportId: inputs.reportId
  });

  // Ensure scope3Category is defined
  if (!inputs.scope3Category) {
    console.error('Missing scope3Category for scope3 calculation');
    return { updatedResults: results, details: '' };
  }

  try {
    // Based on the category, call the appropriate calculation function
    if (inputs.scope3Category === 'transport') {
      console.log('Calling transport calculation');
      return performTransportCalculation(inputs, results);
    } else if (inputs.scope3Category === 'waste') {
      console.log('Calling waste calculation');
      return performWasteCalculation(inputs, results);
    } else if (inputs.scope3Category === 'purchases') {
      console.log('Calling purchase calculation');
      return performPurchaseCalculation(inputs, results);
    } else {
      console.error('Unknown scope3 category:', inputs.scope3Category);
      return { updatedResults: results, details: '' };
    }
  } catch (error) {
    console.error('Error in scope3 calculation:', error);
    return { updatedResults: results, details: '' };
  }
};
