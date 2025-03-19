
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

  if (inputs.wasteType && inputs.wasteQuantity && inputs.wasteQuantity !== '') {
    const quantity = parseFloat(inputs.wasteQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculateScope3Emissions(
        inputs.wasteType, 
        quantity,
        'kg'
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      console.log('Waste calculation results:', {
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
      
      // Save calculation details
      const calculationDetails = {
        wasteType: inputs.wasteType,
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
        source = typeof sourceInfo === 'string' ? sourceInfo : sourceInfo.name;
      }
      
      details = JSON.stringify(calculationDetails);
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};
