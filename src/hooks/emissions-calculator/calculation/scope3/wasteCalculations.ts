
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';

/**
 * Perform waste calculations for Scope 3
 */
export const performWasteCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';

  console.log('Starting waste calculation with inputs:', {
    scope3Category: inputs.scope3Category,
    wasteType: inputs.wasteType,
    wasteQuantity: inputs.wasteQuantity,
    periodType: inputs.periodType
  });

  // Validate required inputs
  if (!inputs.wasteType) {
    console.error('Missing wasteType for waste calculation');
    return { updatedResults: results, details };
  }

  if (!inputs.wasteQuantity || inputs.wasteQuantity === '') {
    console.error('Missing wasteQuantity for waste calculation');
    return { updatedResults: results, details };
  }

  // Always handle quantity as string, then parse it
  const quantityStr = String(inputs.wasteQuantity).replace(',', '.');
  const quantity = parseFloat(quantityStr);
  
  if (isNaN(quantity) || quantity <= 0) {
    console.error('Invalid waste quantity:', inputs.wasteQuantity);
    return { updatedResults: results, details };
  }

  try {
    const emissionsKg = calculateScope3Emissions(
      inputs.wasteType!, 
      quantity,
      'kg'
    );
    const emissionsTonnes = emissionsKg / 1000;
    
    console.log('Waste calculation intermediate results:', {
      wasteType: inputs.wasteType,
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
    
    console.log('Waste calculation updated results:', {
      originalScope3: results.scope3,
      newScope3: updatedResults.scope3,
      addedEmissions: emissionsTonnes
    });
    
    // Save calculation details
    const calculationDetails = {
      scope3Category: 'waste', // Add scope3Category explicitly
      wasteType: inputs.wasteType,
      activityType: inputs.wasteType, // Add this for table display
      quantity,
      unit: 'kg',
      periodType: inputs.periodType,
      emissionsKg,
      emissionsTonnes,
      calculationDate: new Date().toISOString(),
      source: getEmissionFactorSource(inputs.wasteType!)
    };
    
    // Convert the source object to string
    const sourceInfo = calculationDetails.source;
    if (sourceInfo) {
      source = typeof sourceInfo === 'string' ? sourceInfo : 
             (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
    }
    
    details = JSON.stringify(calculationDetails);
    console.log('Processed waste calculation details:', details);
    
    return { updatedResults, details, source };
  } catch (error) {
    console.error('Error in waste calculation:', error);
    return { updatedResults: results, details };
  }
};
