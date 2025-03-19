
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsDetails, EmissionsResults } from '../types';
import { calculateScope2Emissions } from '@/lib/emissions-calculator';

/**
 * Perform Scope 2 emissions calculation
 */
export const performScope2Calculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';

  if (inputs.energyType && inputs.energyQuantity && inputs.energyQuantity !== '') {
    const quantity = parseFloat(inputs.energyQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculateScope2Emissions(
        inputs.energyType, 
        quantity, 
        'kWh', 
        inputs.renewablePercentage !== undefined ? inputs.renewablePercentage / 100 : undefined
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope2: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        energyType: inputs.energyType,
        quantity,
        unit: 'kWh',
        renewablePercentage: inputs.renewablePercentage,
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.energyType)
      };
      
      details = JSON.stringify(calculationDetails);
      source = calculationDetails.source;
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};
