
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from '../types';
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
      
      console.log('Scope 1 calculation results:', {
        fuelType: inputs.fuelType,
        quantity,
        emissionsKg,
        emissionsTonnes
      });
      
      // Update results - IMPORTANT: Add to existing value, not replace
      const updatedResults = {
        ...results,
        scope1: results.scope1 + emissionsTonnes,
        total: results.total + emissionsTonnes
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
