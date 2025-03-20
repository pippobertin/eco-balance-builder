
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

  console.log('Starting purchase calculation with inputs:', {
    purchaseType: inputs.purchaseType,
    purchaseQuantity: inputs.purchaseQuantity,
    purchaseDescription: inputs.purchaseDescription,
    periodType: inputs.periodType
  });

  // Validate required inputs
  if (!inputs.purchaseType) {
    console.error('Missing purchaseType for purchase calculation');
    return { updatedResults: results, details };
  }

  if (!inputs.purchaseQuantity || inputs.purchaseQuantity === '') {
    console.error('Missing purchaseQuantity for purchase calculation');
    return { updatedResults: results, details };
  }

  const quantity = parseFloat(inputs.purchaseQuantity);
  if (isNaN(quantity) || quantity <= 0) {
    console.error('Invalid purchase quantity:', inputs.purchaseQuantity);
    return { updatedResults: results, details };
  }

  try {
    const emissionsKg = calculateScope3Emissions(
      inputs.purchaseType, 
      quantity,
      inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unità'
    );
    const emissionsTonnes = emissionsKg / 1000;
    
    console.log('Purchase calculation results:', {
      purchaseType: inputs.purchaseType,
      quantity,
      emissionsKg,
      emissionsTonnes
    });
    
    // Update results - IMPORTANT: Add to existing value, not replace
    const updatedResults = {
      ...results,
      scope3: results.scope3 + emissionsTonnes,
      total: results.total + emissionsTonnes
    };
    
    // Save calculation details
    const calculationDetails = {
      purchaseType: inputs.purchaseType,
      activityType: inputs.purchaseType, // Add this for table display
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
      source = typeof sourceInfo === 'string' ? sourceInfo : 
             (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
    }
    
    details = JSON.stringify(calculationDetails);
    
    console.log('Purchase calculation details:', {
      details,
      updatedResults
    });
    
    return { updatedResults, details, source };
  } catch (error) {
    console.error('Error in purchase calculation:', error);
    return { updatedResults: results, details };
  }
};
