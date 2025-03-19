
import { getEmissionFactorSource } from '@/lib/emissions-calculator';
import { EmissionsInput, EmissionsResults } from '../../types';
import { calculateScope3Emissions } from '@/lib/emissions-calculator';
import { calculateVehicleEmissions, createVehicleDetailsRecord } from '@/lib/vehicle-emissions';

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
  
  console.log('Transport calculation inputs:', {
    vehicleType: inputs.vehicleType,
    vehicleFuelType: inputs.vehicleFuelType,
    transportType: inputs.transportType,
    vehicleFuelConsumption: inputs.vehicleFuelConsumption,
    transportDistance: inputs.transportDistance
  });
  
  // Check if we're calculating vehicle-based emissions
  if (inputs.vehicleType && inputs.vehicleFuelType && inputs.transportType) {
    // Vehicle emissions calculation (with fuel consumption)
    if (inputs.vehicleFuelConsumption && inputs.transportDistance) {
      const fuelConsumption = parseFloat(inputs.vehicleFuelConsumption);
      const distance = parseFloat(inputs.transportDistance);
      
      if (!isNaN(fuelConsumption) && !isNaN(distance) && fuelConsumption > 0 && distance > 0) {
        console.log("Calculating vehicle emissions for:", {
          vehicleType: inputs.vehicleType,
          fuelType: inputs.vehicleFuelType,
          fuelConsumption,
          distance,
          unit: inputs.vehicleFuelConsumptionUnit || 'l_100km'
        });
        
        const emissionsResult = calculateVehicleEmissions(
          inputs.vehicleType,
          inputs.vehicleEnergyClass || '',
          inputs.vehicleFuelType,
          distance,
          fuelConsumption,
          inputs.vehicleFuelConsumptionUnit as 'l_100km' | 'km_l' || 'l_100km'
        );
        
        console.log("Vehicle emissions calculated:", emissionsResult);
        
        if (emissionsResult) {
          const emissionsTonnes = emissionsResult.emissionsKg / 1000;
          
          // Update results - IMPORTANT: Add to existing value, not replace
          const updatedResults = {
            ...results,
            scope3: results.scope3 + emissionsTonnes,
            total: results.total + emissionsTonnes
          };
          
          // Save calculation details
          const vehicleDetails = createVehicleDetailsRecord(
            inputs.vehicleType,
            inputs.vehicleFuelType,
            inputs.vehicleEnergyClass || '',
            fuelConsumption,
            inputs.vehicleFuelConsumptionUnit || 'l_100km',
            emissionsResult.fuelConsumed,
            emissionsResult.consumptionFactorUsed
          );
          
          const calculationDetails = {
            transportType: inputs.transportType,
            vehicleType: inputs.vehicleType,
            vehicleFuelType: inputs.vehicleFuelType,
            fuelConsumption,
            consumptionUnit: inputs.vehicleFuelConsumptionUnit || 'l_100km',
            distance,
            distanceUnit: 'km',
            periodType: inputs.periodType,
            emissionsKg: emissionsResult.emissionsKg,
            emissionsTonnes,
            calculationDate: new Date().toISOString(),
            source: emissionsResult.source || getEmissionFactorSource(inputs.vehicleFuelType),
            vehicleDetails
          };
          
          // Convert the source object to string
          source = emissionsResult.source || '';
          
          details = JSON.stringify(calculationDetails);
          
          return { updatedResults, details, source };
        } else {
          console.warn("Vehicle emissions calculation returned null or undefined result");
        }
      }
    } 
    // If we don't have fuel consumption but have distance, use simplified transport calculation
    else if (inputs.transportDistance) {
      const distance = parseFloat(inputs.transportDistance);
      
      if (!isNaN(distance) && distance > 0) {
        const emissionsKg = calculateScope3Emissions(
          inputs.transportType || 'BUSINESS_TRAVEL_CAR', 
          distance,
          'km'
        );
        const emissionsTonnes = emissionsKg / 1000;
        
        console.log('Transport calculation results (simplified):', {
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
        
        // Save calculation details
        const calculationDetails = {
          transportType: inputs.transportType,
          distance,
          distanceUnit: 'km',
          periodType: inputs.periodType,
          emissionsKg,
          emissionsTonnes,
          calculationDate: new Date().toISOString(),
          source: getEmissionFactorSource(inputs.transportType || 'BUSINESS_TRAVEL_CAR'),
          vehicleDetails: inputs.vehicleType ? {
            vehicleType: inputs.vehicleType,
            vehicleFuelType: inputs.vehicleFuelType,
            vehicleEnergyClass: inputs.vehicleEnergyClass || '',
          } : undefined
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
  } 
  // Standard transport emissions (no vehicle details)
  else if (inputs.transportType && inputs.transportDistance) {
    const distance = parseFloat(inputs.transportDistance);
    
    if (!isNaN(distance) && distance > 0) {
      const emissionsKg = calculateScope3Emissions(
        inputs.transportType, 
        distance,
        'km'
      );
      const emissionsTonnes = emissionsKg / 1000;
      
      console.log('Transport calculation results (standard):', {
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
      
      // Save calculation details
      const calculationDetails = {
        transportType: inputs.transportType,
        distance,
        distanceUnit: 'km',
        periodType: inputs.periodType,
        emissionsKg,
        emissionsTonnes,
        calculationDate: new Date().toISOString(),
        source: getEmissionFactorSource(inputs.transportType)
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
