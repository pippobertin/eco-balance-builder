
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';
import { calculateVehicleEmissions } from '@/lib/vehicle-emissions';

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
    transportType: inputs.transportType,
    transportDistance: inputs.transportDistance,
    vehicleDetails: {
      vehicleType: inputs.vehicleType,
      vehicleFuelType: inputs.vehicleFuelType,
      vehicleEnergyClass: inputs.vehicleEnergyClass,
      vehicleFuelConsumption: inputs.vehicleFuelConsumption,
      vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
    },
    initialScope3: results.scope3
  });

  if (inputs.transportType && inputs.transportDistance && inputs.transportDistance !== '') {
    const distance = parseFloat(inputs.transportDistance);
    if (!isNaN(distance) && distance > 0) {
      let emissionsKg = 0;
      
      // Check if we have detailed vehicle information
      if (inputs.vehicleType && inputs.vehicleFuelType) {
        // Use vehicle emissions calculation with detailed info
        const consumption = parseFloat(inputs.vehicleFuelConsumption || '0');
        const consumptionUnit = inputs.vehicleFuelConsumptionUnit || 'l_100km';
        const vehicleEnergyClass = inputs.vehicleEnergyClass || '';
        
        console.log('Using vehicle emissions calculation with details:', {
          vehicleType: inputs.vehicleType,
          fuelType: inputs.vehicleFuelType,
          consumption,
          consumptionUnit,
          distance,
          vehicleEnergyClass
        });
        
        emissionsKg = calculateVehicleEmissions(
          inputs.vehicleType,
          inputs.vehicleFuelType,
          consumption,
          consumptionUnit,
          distance,
          vehicleEnergyClass
        );
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
        emissionsTonnes,
        originalScope3: results.scope3,
        newScope3: results.scope3 + emissionsTonnes
      });
      
      // Update results - IMPORTANT: Add to existing value, not replace
      const updatedResults = {
        ...results,
        scope3: results.scope3 + emissionsTonnes,
        total: results.total + emissionsTonnes
      };
      
      // Vehicle details object to store in calculation details
      const vehicleDetails = inputs.vehicleType ? {
        vehicleType: inputs.vehicleType,
        vehicleFuelType: inputs.vehicleFuelType,
        vehicleEnergyClass: inputs.vehicleEnergyClass,
        vehicleFuelConsumption: inputs.vehicleFuelConsumption,
        vehicleFuelConsumptionUnit: inputs.vehicleFuelConsumptionUnit
      } : null;
      
      // Save calculation details
      const calculationDetails = {
        activityType: inputs.transportType,
        quantity: distance,
        unit: 'km',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.transportType),
        vehicleDetails
      };
      
      // Convert the source object to string
      const sourceInfo = calculationDetails.source;
      if (sourceInfo) {
        source = typeof sourceInfo === 'string' ? sourceInfo : 
               (typeof sourceInfo === 'object' && sourceInfo.name ? sourceInfo.name : 'DEFRA');
      }
      
      details = JSON.stringify(calculationDetails);
      
      return { updatedResults, details, source };
    }
  }
  
  return { updatedResults: results, details };
};
