
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
    wasteType: inputs.wasteType,
    wasteQuantity: inputs.wasteQuantity,
    initialResults: results
  });

  if (inputs.wasteType && inputs.wasteQuantity && inputs.wasteQuantity !== '') {
    const quantity = parseFloat(inputs.wasteQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      try {
        const emissionsKg = calculateScope3Emissions(
          inputs.wasteType, 
          quantity,
          'kg'
        );
        const emissionsTonnes = emissionsKg / 1000;
        
        console.log('Waste calculation intermediate results:', {
          wasteType: inputs.wasteType,
          quantity,
          emissionsKg,
          emissionsTonnes,
          originalScope3: results.scope3,
          newScope3Value: results.scope3 + emissionsTonnes
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
          wasteType: inputs.wasteType,
          activityType: inputs.wasteType, // Add this for table display
          quantity,
          unit: 'kg',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.wasteType)
        };
        
        // Convert the source object to string
        const sourceInfo = calculationDetails.source;
        if (sourceInfo) {
          source = typeof sourceInfo === 'string' ? sourceInfo : 
                 (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
        }
        
        details = JSON.stringify(calculationDetails);
        
        return { updatedResults, details, source };
      } catch (error) {
        console.error('Error in waste calculation:', error);
      }
    } else {
      console.log('Invalid waste quantity:', inputs.wasteQuantity);
    }
  } else {
    console.log('Missing waste inputs:', {
      wasteType: inputs.wasteType,
      wasteQuantity: inputs.wasteQuantity
    });
  }
  
  return { updatedResults: results, details };
};
