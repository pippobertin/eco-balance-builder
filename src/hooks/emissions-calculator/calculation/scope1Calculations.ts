
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsDetails, EmissionsResults } from '../types';
import { calculateScope1Emissions } from '@/lib/emissions-calculator';

/**
 * Perform Scope 1 emissions calculation
 */
export const performScope1Calculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';

  if (inputs.fuelType && inputs.fuelQuantity && inputs.fuelQuantity !== '') {
    const quantity = parseFloat(inputs.fuelQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      const emissionsKg = calculateScope1Emissions(
        inputs.fuelType, 
        quantity, 
        inputs.fuelUnit || 'L'
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      // Update results
      const updatedResults = {
        ...results,
        scope1: emissionsTonnes
      };
      
      // Save calculation details
      const calculationDetails = {
        fuelType: inputs.fuelType,
        quantity,
        unit: inputs.fuelUnit,
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.fuelType)
      };
      
      details = JSON.stringify(calculationDetails);
      source = calculationDetails.source;
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};
