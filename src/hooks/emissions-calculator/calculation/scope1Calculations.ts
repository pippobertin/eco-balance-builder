
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

  console.log('Starting scope1 calculation with inputs:', {
    fuelType: inputs.fuelType,
    fuelQuantity: inputs.fuelQuantity,
    fuelUnit: inputs.fuelUnit
  });

  if (inputs.fuelType && inputs.fuelQuantity && inputs.fuelQuantity !== '') {
    const quantity = parseFloat(inputs.fuelQuantity);
    console.log('Parsed fuel quantity:', quantity);
    
    if (!isNaN(quantity) && quantity > 0) {
      // Ensure we're using the correct unit, defaulting to 'L' if not provided
      const unit = inputs.fuelUnit || 'L';
      
      const emissionsKg = calculateScope1Emissions(
        inputs.fuelType, 
        quantity, 
        unit
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      console.log('Scope 1 calculation results:', {
        fuelType: inputs.fuelType,
        quantity,
        unit,
        emissionsKg,
        emissionsTonnes
      });
      
      // Update results - IMPORTANT: Add to existing value, not replace
      const updatedResults = {
        ...results,
        scope1: results.scope1 + emissionsTonnes,
        total: results.total + emissionsTonnes
      };
      
      console.log('Updated results after scope1 calculation:', updatedResults);
      
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
    } else {
      console.warn('Invalid quantity for scope1 calculation:', inputs.fuelQuantity);
    }
  } else {
    console.warn('Missing required inputs for scope1 calculation');
  }
  
  return { updatedResults: results, details };
};
