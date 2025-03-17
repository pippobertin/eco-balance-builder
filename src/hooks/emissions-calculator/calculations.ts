
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { 
  calculateScope1Emissions, 
  calculateScope2Emissions, 
  calculateScope3Emissions 
} from '@/lib/emissions-calculator';

export const performEmissionsCalculation = (
  inputs: EmissionsInput,
  scope?: 'scope1' | 'scope2' | 'scope3'
): { results: EmissionsResults; details: EmissionsDetails } => {
  const results: EmissionsResults = {
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  };
  
  const details: EmissionsDetails = {
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  };
  
  // Calculate Scope 1 emissions if requested or not specified
  if (!scope || scope === 'scope1') {
    if (inputs.fuelType && inputs.fuelQuantity && inputs.fuelQuantity !== '') {
      const quantity = parseFloat(inputs.fuelQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        const emissionsKg = calculateScope1Emissions(
          inputs.fuelType, 
          quantity, 
          inputs.fuelUnit || 'L'
        );
        const emissionsTonnes = emissionsKg / 1000;
        results.scope1 = emissionsTonnes;
        
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
        
        details.scope1Details = JSON.stringify(calculationDetails);
      }
    }
  }
  
  // Calculate Scope 2 emissions if requested or not specified
  if (!scope || scope === 'scope2') {
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
        results.scope2 = emissionsTonnes;
        
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
        
        details.scope2Details = JSON.stringify(calculationDetails);
      }
    }
  }
  
  // Calculate Scope 3 emissions if requested or not specified
  if (!scope || scope === 'scope3') {
    if (inputs.scope3Category === 'transport' && inputs.transportType && inputs.transportDistance && inputs.transportDistance !== '') {
      const distance = parseFloat(inputs.transportDistance);
      if (!isNaN(distance) && distance > 0) {
        const emissionsKg = calculateScope3Emissions(
          inputs.transportType,
          distance,
          'km'
        );
        const emissionsTonnes = emissionsKg / 1000;
        results.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: inputs.transportType,
          quantity: distance,
          unit: 'km',
          secondaryQuantity: 0,
          secondaryUnit: 't',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.transportType)
        };
        
        details.scope3Details = JSON.stringify(calculationDetails);
      }
    } else if (inputs.scope3Category === 'waste' && inputs.wasteType && inputs.wasteQuantity && inputs.wasteQuantity !== '') {
      const quantity = parseFloat(inputs.wasteQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        const emissionsKg = calculateScope3Emissions(
          inputs.wasteType,
          quantity,
          'kg'
        );
        const emissionsTonnes = emissionsKg / 1000;
        results.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: inputs.wasteType,
          quantity,
          unit: 'kg',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.wasteType)
        };
        
        details.scope3Details = JSON.stringify(calculationDetails);
      }
    } else if (inputs.scope3Category === 'purchases' && inputs.purchaseType && inputs.purchaseQuantity && inputs.purchaseQuantity !== '') {
      const quantity = parseFloat(inputs.purchaseQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        const emissionsKg = calculateScope3Emissions(
          inputs.purchaseType,
          quantity,
          inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit'
        );
        const emissionsTonnes = emissionsKg / 1000;
        results.scope3 = emissionsTonnes;
        
        // Save calculation details
        const calculationDetails = {
          activityType: inputs.purchaseType,
          quantity,
          unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.purchaseType)
        };
        
        details.scope3Details = JSON.stringify(calculationDetails);
      }
    }
  }
  
  // Calculate total emissions
  results.total = results.scope1 + results.scope2 + results.scope3;
  
  return { results, details };
};
