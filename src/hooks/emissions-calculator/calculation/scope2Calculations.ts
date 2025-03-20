
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../types';
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

  console.log('Starting scope2 calculation with inputs:', inputs);

  // Validate required inputs
  if (!inputs.energyType) {
    console.error('Missing energy type for scope2 calculation');
    return { updatedResults: results, details };
  }

  if (!inputs.energyQuantity || inputs.energyQuantity === '') {
    console.error('Missing energy quantity for scope2 calculation');
    return { updatedResults: results, details };
  }

  const quantity = parseFloat(inputs.energyQuantity);
  if (isNaN(quantity) || quantity <= 0) {
    console.error('Invalid energy quantity for scope2 calculation:', inputs.energyQuantity);
    return { updatedResults: results, details };
  }

  // Ensure renewable percentage is a number
  const renewablePercentage = typeof inputs.renewablePercentage === 'number' ? 
    inputs.renewablePercentage : 
    (inputs.renewablePercentage ? parseFloat(String(inputs.renewablePercentage)) : 0);
  
  try {
    const emissionsKg = calculateScope2Emissions(
      inputs.energyType, 
      quantity,
      'kWh',
      renewablePercentage / 100 // Convert percentage to decimal
    );
    const emissionsTonnes = emissionsKg / 1000;
    
    console.log('Scope 2 calculation results:', {
      energyType: inputs.energyType,
      quantity,
      renewablePercentage,
      emissionsKg,
      emissionsTonnes
    });
    
    // Update results - IMPORTANT: Add to existing value, not replace
    const updatedResults = {
      ...results,
      scope2: results.scope2 + emissionsTonnes,
      total: results.total + emissionsTonnes
    };
    
    // Save calculation details
    const calculationDetails = {
      energyType: inputs.energyType,
      energyProvider: inputs.energyProvider || '',
      quantity,
      unit: 'kWh',
      renewablePercentage,
      periodType: inputs.periodType,
      emissionsKg,
      emissionsTonnes,
      calculationDate: new Date().toISOString(),
      source: getEmissionFactorSource(inputs.energyType)
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
    console.error('Error in scope2 calculation:', error);
    return { updatedResults: results, details };
  }
};
