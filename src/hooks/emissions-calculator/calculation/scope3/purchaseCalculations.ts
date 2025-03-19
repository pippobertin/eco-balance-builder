
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';

/**
 * Perform purchase calculations for Scope 3
 */
export const performPurchaseCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string; 
  source?: string;
} => {
  let details = '';
  let source = '';

  if (inputs.purchaseType && inputs.purchaseQuantity && inputs.purchaseQuantity !== '') {
    const quantity = parseFloat(inputs.purchaseQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculateScope3Emissions(
        inputs.purchaseType, 
        quantity,
        inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unità'
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope3: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        purchaseType: inputs.purchaseType,
        description: inputs.purchaseDescription || '',
        quantity,
        unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unità',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.purchaseType)
      };
      
      // Convert the source object to string
      const sourceInfo = calculationDetails.source;
      if (sourceInfo) {
        source = typeof sourceInfo === 'string' ? sourceInfo : sourceInfo.name;
      }
      
      details = JSON.stringify(calculationDetails);
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};
