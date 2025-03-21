
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';
import { calculateVehicleEmissions } from '@/lib/vehicle-emissions';
import { FuelType } from '@/lib/emissions-types';

/**
 * Perform transport calculations for Scope 3
 */
export const performTransportCalculation = (
  inputs: EmissionsInput,
  results: EmissionsResults
): { 
  updatedResults: EmissionsResults; 
  details: string;
  source?: string;
} => {
  let details = '';
  let source = '';

  console.log('Starting transport calculation with inputs:', {
    scope3Category: inputs.scope3Category,
    transportType: inputs.transportType,
    transportDistance: inputs.transportDistance,
    vehicleDetails: {
      vehicleType: inputs.vehicleType,
      vehicleFuelType: inputs.vehicleFuelType,
      vehicleEnergyClass: inputs.vehicleEnergyClass,
      vehicleFuelConsumption: inputs.vehicleFuelConsumption,
      vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
    }
  });

  // Validate required inputs
  if (!inputs.transportType) {
    console.error('Missing transportType for transport calculation');
    return { updatedResults: results, details };
  }

  if (!inputs.transportDistance || inputs.transportDistance === '') {
    console.error('Missing transportDistance for transport calculation');
    return { updatedResults: results, details };
  }

  const distance = parseFloat(String(inputs.transportDistance).replace(',', '.'));
  if (isNaN(distance) || distance <= 0) {
    console.error('Invalid transport distance:', inputs.transportDistance);
    return { updatedResults: results, details };
  }

  try {
    let emissionsKg = 0;
    
    // Check if we have detailed vehicle information
    if (inputs.vehicleType && inputs.vehicleFuelType) {
      // Use vehicle emissions calculation with detailed info
      const consumption = inputs.vehicleFuelConsumption || '0';
      const consumptionUnit = inputs.vehicleFuelConsumptionUnit || 'l_100km';
      const vehicleEnergyClass = inputs.vehicleEnergyClass || '';
      const vehicleFuelType = inputs.vehicleFuelType as FuelType;
      
      console.log('Using vehicle emissions calculation with details:', {
        vehicleType: inputs.vehicleType,
        fuelType: vehicleFuelType,
        consumption,
        consumptionUnit,
        distance,
        vehicleEnergyClass
      });
      
      // Extract only emissionsKg from the object returned by calculateVehicleEmissions
      const vehicleEmissionsResult = calculateVehicleEmissions(
        inputs.vehicleType,
        vehicleEnergyClass,
        vehicleFuelType,
        distance,
        consumption,
        consumptionUnit as 'l_100km' | 'km_l'
      );
      
      emissionsKg = vehicleEmissionsResult.emissionsKg;
      source = vehicleEmissionsResult.source;
    } else {
      // Use standard transport emissions calculation
      console.log('Using standard transport emissions calculation for:', inputs.transportType);
      emissionsKg = calculateScope3Emissions(
        inputs.transportType, 
        distance,
        'km'
      );
    }
    
    const emissionsTonnes = emissionsKg / 1000;
    
    console.log('Transport calculation results:', {
      transportType: inputs.transportType,
      distance,
      emissionsKg,
      emissionsTonnes
    });
    
    // Update results - IMPORTANT: Add to existing value, not replace
    const updatedResults = {
      ...results,
      scope3: results.scope3 + emissionsTonnes,
      total: results.total + emissionsTonnes
    };
    
    // Enhanced vehicle details object
    const vehicleDetails = inputs.vehicleType ? {
      vehicleType: inputs.vehicleType,
      vehicleFuelType: inputs.vehicleFuelType,
      vehicleEnergyClass: inputs.vehicleEnergyClass || 'euro6',
      vehicleFuelConsumption: inputs.vehicleFuelConsumption,
      vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
    } : null;
    
    // Save calculation details - make sure to include all vehicle information directly
    const calculationDetails = {
      scope3Category: inputs.scope3Category || 'transport', // Add scope3Category explicitly
      transportType: inputs.transportType,
      activityType: inputs.transportType, // Add this for table display
      quantity: distance,
      unit: 'km',
      periodType: inputs.periodType,
      emissionsKg,
      emissionsTonnes,
      calculationDate: new Date().toISOString(),
      source: source || getEmissionFactorSource(inputs.transportType),
      
      // Include vehicle details in top level for better accessibility
      vehicleType: inputs.vehicleType,
      vehicleFuelType: inputs.vehicleFuelType,
      vehicleEnergyClass: inputs.vehicleEnergyClass || 'euro6',
      vehicleFuelConsumption: inputs.vehicleFuelConsumption,
      vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit,
      
      // Keep the nested structure for backward compatibility
      vehicleDetails
    };
    
    // Convert the source object to string
    const sourceInfo = calculationDetails.source;
    if (sourceInfo) {
      source = typeof sourceInfo === 'string' ? sourceInfo : 
             (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
    }
    
    details = JSON.stringify(calculationDetails);
    console.log('Processed transport calculation details:', details);
    
    return { updatedResults, details, source };
  } catch (error) {
    console.error('Error in transport calculation:', error);
    return { updatedResults: results, details };
  }
};
