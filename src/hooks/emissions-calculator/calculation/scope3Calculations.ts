
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';
import { 
  calculateVehicleEmissions, 
  createVehicleDetailsRecord 
} from '@/lib/vehicle-emissions';

/**
 * Handle transport-related Scope 3 emissions calculations
 */
export const performTransportCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  if (!inputs.transportDistance || inputs.transportDistance === '') {
    return { updatedResults: results, details: '' };
  }

  const distance = parseFloat(inputs.transportDistance);
  if (isNaN(distance) || distance <= 0) {
    return { updatedResults: results, details: '' };
  }

  console.log('Calcolo Scope 3 per trasporto:', {
    transportType: inputs.transportType,
    distance,
    vehicleDetails: {
      vehicleType: inputs.vehicleType,
      vehicleEnergyClass: inputs.vehicleEnergyClass,
      vehicleFuelType: inputs.vehicleFuelType,
      fuelConsumption: inputs.vehicleFuelConsumption,
      fuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
    }
  });
  
  let emissionsKg;
  let emissionSource;
  let vehicleDetails = null;
  
  // Check if we have vehicle details to use the vehicle emissions factors
  if (inputs.vehicleType && inputs.vehicleEnergyClass && inputs.vehicleFuelType) {
    // Use the vehicle emissions utility
    const fuelConsumption = inputs.vehicleFuelConsumption ? parseFloat(inputs.vehicleFuelConsumption) : null;
    
    const vehicleEmissions = calculateVehicleEmissions(
      inputs.vehicleType,
      inputs.vehicleEnergyClass,
      inputs.vehicleFuelType,
      distance,
      fuelConsumption && !isNaN(fuelConsumption) ? fuelConsumption : undefined,
      inputs.vehicleFuelConsumptionUnit as 'l_100km' | 'km_l'
    );
    
    emissionsKg = vehicleEmissions.emissionsKg;
    emissionSource = vehicleEmissions.source;
    
    console.log('Risultato calcolo emissioni veicolo:', {
      emissionsKg,
      emissionsSource: emissionSource,
      fuelConsumed: vehicleEmissions.fuelConsumed,
      consumptionFactorUsed: vehicleEmissions.consumptionFactorUsed
    });
    
    // Create vehicle details record
    vehicleDetails = createVehicleDetailsRecord(
      inputs.vehicleType,
      inputs.vehicleFuelType,
      inputs.vehicleEnergyClass,
      fuelConsumption && !isNaN(fuelConsumption) ? fuelConsumption : null,
      inputs.vehicleFuelConsumptionUnit || 'l_100km',
      vehicleEmissions.fuelConsumed > 0 ? vehicleEmissions.fuelConsumed : null,
      vehicleEmissions.consumptionFactorUsed > 0 ? vehicleEmissions.consumptionFactorUsed : null
    );
  } else {
    // Fallback to standard transport emission factors if vehicle details not provided
    emissionsKg = calculateScope3Emissions(
      inputs.transportType || 'BUSINESS_TRAVEL_CAR',
      distance,
      'km'
    );
    emissionSource = getEmissionFactorSource(inputs.transportType || 'BUSINESS_TRAVEL_CAR');
    
    console.log('Fallback al calcolo emissioni di trasporto standard:', {
      emissionsKg,
      emissionsSource: emissionSource
    });
  }
  
  // Ensure we have a valid emission value
  if (isNaN(emissionsKg) || !isFinite(emissionsKg)) {
    console.warn('Valore di emissione non valido, impostazione a 0');
    emissionsKg = 0;
  }
  
  // Convert from kg to tonnes and update results
  const emissionsTonnes = emissionsKg / 1000;
  const updatedResults = {
    ...results,
    scope3: emissionsTonnes
  };
  
  console.log('Emissioni finali calcolate:', {
    emissionsKg,
    emissionsTonnes,
    scope3Total: updatedResults.scope3
  });
  
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
    source: emissionSource,
    // Add vehicle details to the calculation details if available
    vehicleDetails: vehicleDetails
  };
  
  return { 
    updatedResults, 
    details: JSON.stringify(calculationDetails),
    source: emissionSource
  };
};

/**
 * Handle waste-related Scope 3 emissions calculations
 */
export const performWasteCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  if (!inputs.wasteType || !inputs.wasteQuantity || inputs.wasteQuantity === '') {
    return { updatedResults: results, details: '' };
  }

  const quantity = parseFloat(inputs.wasteQuantity);
  if (isNaN(quantity) || quantity <= 0) {
    return { updatedResults: results, details: '' };
  }

  const emissionsKg = calculateScope3Emissions(
    inputs.wasteType,
    quantity,
    'kg'
  );
  const emissionsTonnes = emissionsKg / 1000;
  const updatedResults = {
    ...results,
    scope3: emissionsTonnes
  };
  
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
  
  return { 
    updatedResults, 
    details: JSON.stringify(calculationDetails),
    source: calculationDetails.source
  };
};

/**
 * Handle purchase-related Scope 3 emissions calculations
 */
export const performPurchaseCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  if (!inputs.purchaseType || !inputs.purchaseQuantity || inputs.purchaseQuantity === '') {
    return { updatedResults: results, details: '' };
  }

  const quantity = parseFloat(inputs.purchaseQuantity);
  if (isNaN(quantity) || quantity <= 0) {
    return { updatedResults: results, details: '' };
  }

  const emissionsKg = calculateScope3Emissions(
    inputs.purchaseType,
    quantity,
    inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit'
  );
  const emissionsTonnes = emissionsKg / 1000;
  const updatedResults = {
    ...results,
    scope3: emissionsTonnes
  };
  
  // Save calculation details
  const calculationDetails = {
    activityType: inputs.purchaseType,
    quantity,
    unit: inputs.purchaseType === 'PURCHASED_GOODS' ? 'kg' : 'unit',
    periodType: inputs.periodType,
    emissionsKg,
    emissionsTonnes,
    calculationDate: new Date().toISOString(),
    source: getEmissionFactorSource(inputs.purchaseType),
    description: inputs.purchaseDescription || ''
  };
  
  return { 
    updatedResults, 
    details: JSON.stringify(calculationDetails),
    source: calculationDetails.source
  };
};

/**
 * Perform Scope 3 emissions calculation based on category
 */
export const performScope3Calculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string; 
} => {
  if (!inputs.scope3Category) {
    return { updatedResults: results, details: '' };
  }

  switch (inputs.scope3Category) {
    case 'transport':
      return performTransportCalculation(inputs, results);
    case 'waste':
      return performWasteCalculation(inputs, results);
    case 'purchases':
      return performPurchaseCalculation(inputs, results);
    default:
      return { updatedResults: results, details: '' };
  }
};
