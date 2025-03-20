
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
    fuelUnit: inputs.fuelUnit,
    fullInputs: inputs
  });

  if (!inputs.fuelType) {
    console.error('Missing fuel type for calculation');
    return { updatedResults: results, details };
  }

  if (!inputs.fuelQuantity || inputs.fuelQuantity === '') {
    console.error('Missing fuel quantity for calculation');
    return { updatedResults: results, details };
  }

  // Parse fuel quantity as a number
  const quantity = parseFloat(String(inputs.fuelQuantity).replace(',', '.'));
  console.log('Parsed fuel quantity:', quantity);
  
  if (isNaN(quantity) || quantity <= 0) {
    console.error('Invalid fuel quantity:', inputs.fuelQuantity);
    return { updatedResults: results, details };
  }

  // Ensure we're using the correct unit, defaulting to 'L' if not provided
  const unit = inputs.fuelUnit || 'L';
  
  // Call the calculation function from the emissions calculator library
  console.log('Calling calculateScope1Emissions with:', {
    fuelType: inputs.fuelType,
    quantity,
    unit
  });
  
  try {
    const emissionsKg = calculateScope1Emissions(
      inputs.fuelType, 
      quantity, 
      unit
    );
    
    console.log('Received emissions result in kg:', emissionsKg);
    
    if (typeof emissionsKg !== 'number' || isNaN(emissionsKg)) {
      console.error('Invalid emissions result:', emissionsKg);
      return { updatedResults: results, details };
    }
    
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
  } catch (error) {
    console.error('Error calculating scope1 emissions:', error);
    return { updatedResults: results, details };
  }
};
