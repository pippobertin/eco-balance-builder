
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from '../types';
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
      const renewablePercentage = inputs.renewablePercentage ? parseFloat(inputs.renewablePercentage.toString()) : 0;
      
      const emissionsKg = calculateScope2Emissions(
        inputs.energyType, 
        quantity, 
        renewablePercentage
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
        renewablePercentage,
        provider: inputs.energyProvider,
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.energyType)
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
