
import { FuelType } from '@/lib/emissions-types';
import { 
  getVehicleEmissionFactor, 
  getVehicleEmissionFactorSource, 
  VEHICLE_EMISSION_FACTORS 
} from '@/lib/vehicle-emissions-factors';

/**
 * Calculate vehicle emissions based on distance, vehicle details, and consumption data
 */
export const calculateVehicleEmissions = (
  vehicleType: string,
  vehicleEnergyClass: string,
  vehicleFuelType: FuelType,
  distance: number,
  fuelConsumption?: number | string,
  fuelConsumptionUnit?: 'l_100km' | 'km_l'
): {
  emissionsKg: number;
  fuelConsumed: number;
  consumptionFactorUsed: number;
  emissionFactor: number;
  source: string;
} => {
  console.log('Starting vehicle emissions calculation with:', {
    vehicleType,
    vehicleEnergyClass,
    vehicleFuelType,
    distance,
    fuelConsumption,
    fuelConsumptionUnit
  });

  // Get emission factor from vehicle database in g CO2e/km
  const emissionFactor = getVehicleEmissionFactor(
    vehicleType,
    vehicleEnergyClass,
    vehicleFuelType
  );
  
  const source = getVehicleEmissionFactorSource(
    vehicleType,
    vehicleEnergyClass,
    vehicleFuelType
  );

  console.log('Retrieved emission factor:', emissionFactor, 'Source:', source);

  // Ensure the emission factor is a valid number
  const validEmissionFactor = Number(emissionFactor) || 0;

  let emissionsKg = 0;
  let fuelConsumed = 0;
  let consumptionFactorUsed = 0;

  // Ensure fuelConsumption is a number
  const parsedFuelConsumption = fuelConsumption !== undefined ? Number(fuelConsumption) : 0;

  // Apply fuel consumption if available
  if (parsedFuelConsumption > 0 && fuelConsumptionUnit) {
    console.log('Using fuel consumption for calculation:', parsedFuelConsumption, fuelConsumptionUnit);
    
    // Convert consumption to L/100km for calculation
    if (fuelConsumptionUnit === 'km_l') {
      // From km/L to L/100km
      consumptionFactorUsed = 100 / parsedFuelConsumption;
    } else {
      // Already in L/100km
      consumptionFactorUsed = parsedFuelConsumption;
    }
    
    console.log('Consumption factor used:', consumptionFactorUsed, 'L/100km');
    
    // Calculate total fuel consumed for the journey in liters
    fuelConsumed = (distance * consumptionFactorUsed) / 100;
    console.log('Fuel consumed for the journey:', fuelConsumed, 'liters');
    
    // Calculate emissions based on the theoretical fuel consumption
    if (vehicleFuelType === 'ELECTRIC') {
      // For electric vehicles, still use the emission factor per km
      emissionsKg = (validEmissionFactor * distance) / 1000;
      console.log('Electric vehicle emissions calculation:', emissionsKg);
    } else {
      // For fuel-based vehicles, use combination of distance-based and consumption-based calculation
      // Fuel-specific emission factor (kg CO2e/L) - simplified values
      const fuelEmissionFactors: Record<string, number> = {
        'DIESEL': 2.68,
        'GASOLINE': 2.31,
        'LPG': 1.51,
        'NATURAL_GAS': 2.02,
        'BIOFUEL': 1.13,
        'HYBRID': 1.90, // Average between gasoline and electric
        'ELECTRIC': 0 // Electric doesn't use fuel in the same way
      };
      
      const fuelSpecificFactor = fuelEmissionFactors[vehicleFuelType] || 2.31; // Default to gasoline if not found
      
      // Calculate emissions based on fuel consumed
      emissionsKg = fuelConsumed * fuelSpecificFactor;
      console.log('Fuel-based emissions calculation:', {
        fuelConsumed,
        fuelSpecificFactor,
        emissionsKg
      });

      // Check if emissions calculation is valid
      if (isNaN(emissionsKg) || !isFinite(emissionsKg) || emissionsKg === 0) {
        // Fallback to distance-based calculation if consumption-based calculation fails
        emissionsKg = (validEmissionFactor * distance) / 1000;
        console.log('Fallback to distance-based calculation:', emissionsKg);
      }
    }
  } else {
    // Standard calculation without consumption data
    emissionsKg = (validEmissionFactor * distance) / 1000;
    console.log('Standard distance-based calculation:', emissionsKg);
  }

  // Ensure emissions is a positive valid number
  emissionsKg = Math.max(0, isNaN(emissionsKg) ? 0 : emissionsKg);

  // Log for debugging
  console.log('Vehicle emissions calculation results:', {
    vehicleType,
    vehicleEnergyClass,
    vehicleFuelType,
    distance,
    emissionFactor: validEmissionFactor,
    fuelConsumption: parsedFuelConsumption,
    fuelConsumptionUnit,
    fuelConsumed,
    consumptionFactorUsed,
    emissionsKg
  });

  return {
    emissionsKg,
    fuelConsumed,
    consumptionFactorUsed,
    emissionFactor: validEmissionFactor,
    source
  };
};

/**
 * Create vehicle details object for calculation records
 */
export const createVehicleDetailsRecord = (
  vehicleType: string,
  vehicleFuelType: FuelType,
  vehicleEnergyClass: string,
  fuelConsumption: number | null,
  fuelConsumptionUnit: string,
  fuelConsumed: number | null,
  consumptionFactorUsed: number | null
) => {
  return {
    vehicleType: vehicleType || '',
    vehicleFuelType: vehicleFuelType || 'DIESEL',
    vehicleEnergyClass: vehicleEnergyClass || '',
    fuelConsumption: fuelConsumption,
    fuelConsumptionUnit: fuelConsumptionUnit || 'l_100km',
    totalFuelConsumed: fuelConsumed,
    consumptionFactorUsed: consumptionFactorUsed,
    emissionFactor: vehicleType && vehicleEnergyClass && vehicleFuelType ? 
      getVehicleEmissionFactor(vehicleType, vehicleEnergyClass, vehicleFuelType) : null
  };
};

/**
 * Check if the calculation has valid vehicle details
 */
export const hasValidVehicleDetails = (calculation: any): boolean => {
  return calculation?.details?.vehicleDetails && 
         calculation.details.vehicleDetails.vehicleType &&
         calculation.details.vehicleDetails.vehicleFuelType &&
         calculation.details.vehicleDetails.vehicleEnergyClass;
};

// Export the vehicle emission factors for reference
export { VEHICLE_EMISSION_FACTORS, getVehicleEmissionFactor, getVehicleEmissionFactorSource };
