
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
    scope3Category: inputs.scope3Category,
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

  // Always handle quantity as string, then parse it
  const quantityStr = String(inputs.purchaseQuantity).replace(',', '.');
  const quantity = parseFloat(quantityStr);
  
  if (isNaN(quantity) || quantity <= 0) {
    console.error('Invalid purchase quantity:', inputs.purchaseQuantity);
    return { updatedResults: results, details };
  }

  try {
    const emissionsKg = calculateScope3Emissions(
      inputs.purchaseType!, 
      quantity,
      'kg'
    );
    const emissionsTonnes = emissionsKg / 1000;
    
    console.log('Purchase calculation intermediate results:', {
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
    
    console.log('Purchase calculation updated results:', {
      originalScope3: results.scope3,
      newScope3: updatedResults.scope3,
      addedEmissions: emissionsTonnes
    });
    
    // Save calculation details with description
    const calculationDetails = {
      scope3Category: 'purchases', // Add scope3Category explicitly
      purchaseType: inputs.purchaseType,
      activityType: inputs.purchaseType, // Add this for table display
      purchaseDescription: inputs.purchaseDescription || '',
      description: inputs.purchaseDescription || '', // Add at top level for better access
      quantity,
      unit: 'kg',
      periodType: inputs.periodType,
      emissionsKg,
      emissionsTonnes,
      calculationDate: new Date().toISOString(),
      source: getEmissionFactorSource(inputs.purchaseType!)
    };
    
    // Convert the source object to string
    const sourceInfo = calculationDetails.source;
    if (sourceInfo) {
      source = typeof sourceInfo === 'string' ? sourceInfo : 
             (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
    }
    
    details = JSON.stringify(calculationDetails);
    console.log('Processed purchase calculation details:', details);
    
    return { updatedResults, details, source };
  } catch (error) {
    console.error('Error in purchase calculation:', error);
    return { updatedResults: results, details };
  }
};
