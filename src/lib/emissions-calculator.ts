
// Emission factors for different fuel types (kgCO2e per unit)
const EMISSION_FACTORS = {
  // Fuel types (kgCO2e per liter or kg)
  diesel: 2.68,
  gasoline: 2.31,
  naturalGas: 2.02,
  lpg: 1.51,
  coal: 2.42,
  
  // Energy types (kgCO2e per kWh)
  electricity: 0.233, // Average grid mix
  renewableEnergy: 0.0,
  
  // Transport modes (kgCO2e per km)
  car: 0.17,
  truck: 0.85,
  train: 0.04,
  ship: 0.015,
  plane: 0.25
};

// Conversion factors for different units
const UNIT_CONVERSIONS = {
  liters: 1,
  kg: 1,
  kWh: 1,
  MWh: 1000,
  km: 1
};

/**
 * Calculate CO2 emissions based on activity type, quantity and unit
 * @param activityType - Type of activity (fuel, energy or transport type)
 * @param quantity - Amount of activity
 * @param unit - Unit of measurement
 * @returns - CO2 emissions in kgCO2e (or tonnes if quantity large)
 */
export const calculateCO2Emissions = (
  activityType: string,
  quantity: number,
  unit: string
): number => {
  // Default to a moderate emission factor if specific type not found
  const emissionFactor = EMISSION_FACTORS[activityType.toLowerCase() as keyof typeof EMISSION_FACTORS] || 1.0;
  
  // Get unit conversion factor (default to 1 if unit not found)
  const unitConversion = UNIT_CONVERSIONS[unit.toLowerCase() as keyof typeof UNIT_CONVERSIONS] || 1;
  
  // Calculate emissions
  const emissions = emissionFactor * quantity * unitConversion;
  
  // Convert to tonnes for very large values
  return emissions > 1000 ? emissions / 1000 : emissions;
};
