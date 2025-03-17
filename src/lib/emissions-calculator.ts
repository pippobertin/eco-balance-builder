
import { EmissionFactor, EmissionFactorSource, EmissionScope, FuelType, EnergyType, TransportType, WasteType, PurchaseType } from './emissions-types';

// Emission factors sourced from IPCC, DEFRA, and ISPRA
// Values in kgCO2e per unit specified
export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Scope 1 - Fuel types
  DIESEL: { 
    value: 2.68, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Diesel fuel'
  },
  GASOLINE: { 
    value: 2.31, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Gasoline/Petrol'
  },
  NATURAL_GAS: { 
    value: 2.02, 
    unit: 'kg/m³',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Natural gas'
  },
  LPG: { 
    value: 1.51, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Liquefied Petroleum Gas'
  },
  BIOMASS_PELLET: { 
    value: 0.04, 
    unit: 'kg/kg',
    source: EmissionFactorSource.IPCC,
    scope: EmissionScope.SCOPE1,
    description: 'Wood pellets (biomass)'
  },
  BIOMASS_WOOD: { 
    value: 0.03, 
    unit: 'kg/kg',
    source: EmissionFactorSource.IPCC,
    scope: EmissionScope.SCOPE1,
    description: 'Wood logs (biomass)'
  },
  BIOFUEL: { 
    value: 1.13, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Biofuel blend'
  },
  COAL: { 
    value: 2.42, 
    unit: 'kg/kg',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Coal'
  },
  FUEL_OIL: { 
    value: 3.17, 
    unit: 'kg/L',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE1,
    description: 'Fuel oil'
  },
  
  // Scope 2 - Energy types
  ELECTRICITY_IT: { 
    value: 0.233, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Grid electricity (Italy)'
  },
  ELECTRICITY_EU: { 
    value: 0.256, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE2,
    description: 'Grid electricity (EU average)'
  },
  ELECTRICITY_RENEWABLE: { 
    value: 0.0, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Renewable energy (solar, wind)'
  },
  ELECTRICITY_COGENERATION: { 
    value: 0.181, 
    unit: 'kg/kWh',
    source: EmissionFactorSource.ISPRA,
    scope: EmissionScope.SCOPE2,
    description: 'Cogeneration/Combined heat and power'
  },
  
  // Scope 3 - Transport and other indirect emissions
  FREIGHT_ROAD: { 
    value: 0.107, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Road freight (average truck)'
  },
  FREIGHT_RAIL: { 
    value: 0.028, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Rail freight'
  },
  FREIGHT_SEA: { 
    value: 0.015, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Sea freight'
  },
  FREIGHT_AIR: { 
    value: 0.654, 
    unit: 'kg/t·km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Air freight'
  },
  BUSINESS_TRAVEL_CAR: { 
    value: 0.17, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Business travel - car (average)'
  },
  BUSINESS_TRAVEL_TRAIN: { 
    value: 0.03, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Business travel - train'
  },
  BUSINESS_TRAVEL_FLIGHT_SHORT: { 
    value: 0.154, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Business travel - short haul flight (<1500km)'
  },
  BUSINESS_TRAVEL_FLIGHT_LONG: { 
    value: 0.114, 
    unit: 'kg/km',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Business travel - long haul flight (>1500km)'
  },
  WASTE_LANDFILL: { 
    value: 458, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Waste disposal - landfill (general)'
  },
  WASTE_RECYCLED: { 
    value: 21, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Waste disposal - recycling (average)'
  },
  WASTE_INCINERATION: { 
    value: 21.3, 
    unit: 'kg/t',
    source: EmissionFactorSource.DEFRA,
    scope: EmissionScope.SCOPE3,
    description: 'Waste disposal - incineration'
  }
};

// Unit conversion factors to standardize inputs
export const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  // Fuel conversions to standard units
  FUEL: {
    'L': 1, // liter (base unit)
    'kL': 1000, // kiloliter to liter
    'gal': 3.78541, // US gallon to liter
    'kg': 1, // kg (for solid fuels - base unit)
    't': 1000, // metric ton to kg
    'm³': 1, // cubic meter (for gases - base unit)
    'ft³': 0.0283168, // cubic feet to cubic meter
    'kWh': 1, // kWh (for energy content - base unit)
    'MWh': 1000, // MWh to kWh
    'GJ': 277.778 // GJ to kWh
  },
  
  // Energy conversions
  ENERGY: {
    'kWh': 1, // kWh (base unit)
    'MWh': 1000, // MWh to kWh
    'GWh': 1000000, // GWh to kWh
    'GJ': 277.778 // GJ to kWh
  },
  
  // Transport conversions
  TRANSPORT: {
    'km': 1, // kilometer (base unit)
    'mi': 1.60934, // miles to km
    't·km': 1, // tonne-kilometer (base unit for freight)
    'kg·km': 0.001 // kg-kilometer to tonne-kilometer
  },
  
  // Waste conversions
  WASTE: {
    'kg': 0.001, // kg to tonnes
    't': 1 // tonnes (base unit)
  }
};

// Energy mix percentages for different countries (for Scope 2 calculations)
export const ENERGY_MIX = {
  IT: {
    renewable: 0.41, // 41% renewable in Italy (example)
    fossil: 0.59
  },
  EU: {
    renewable: 0.38, // 38% renewable in EU average (example)
    fossil: 0.62
  }
};

/**
 * Calculate CO2 emissions for Scope 1 (direct emissions from fuel combustion)
 * @param fuelType - Type of fuel used
 * @param quantity - Amount of fuel
 * @param unit - Unit of measurement
 * @returns - CO2 emissions in kgCO2e
 */
export const calculateScope1Emissions = (
  fuelType: FuelType,
  quantity: number,
  unit: string
): number => {
  // Get the emission factor for the fuel type
  const emissionFactor = EMISSION_FACTORS[fuelType];
  
  if (!emissionFactor) {
    console.warn(`Emission factor not found for fuel type: ${fuelType}`);
    return 0;
  }
  
  // Get the conversion factor for the unit
  const conversionFactor = UNIT_CONVERSIONS.FUEL[unit] || 1;
  
  // Calculate emissions
  const standardizedQuantity = quantity * conversionFactor;
  const emissions = emissionFactor.value * standardizedQuantity;
  
  return emissions;
};

/**
 * Calculate CO2 emissions for Scope 2 (indirect emissions from purchased electricity)
 * @param energyType - Type of energy
 * @param quantity - Amount of energy
 * @param unit - Unit of measurement
 * @param renewablePercentage - Optional: percentage of energy from renewable sources (0-1)
 * @returns - CO2 emissions in kgCO2e
 */
export const calculateScope2Emissions = (
  energyType: EnergyType,
  quantity: number,
  unit: string,
  renewablePercentage?: number
): number => {
  // Get the emission factor for the energy type
  const emissionFactor = EMISSION_FACTORS[energyType];
  
  if (!emissionFactor) {
    console.warn(`Emission factor not found for energy type: ${energyType}`);
    return 0;
  }
  
  // Get the conversion factor for the unit
  const conversionFactor = UNIT_CONVERSIONS.ENERGY[unit] || 1;
  
  // Calculate standardized quantity
  const standardizedQuantity = quantity * conversionFactor;
  
  // Apply renewable percentage if provided (for mixed grid electricity)
  let adjustedEmissionFactor = emissionFactor.value;
  if (renewablePercentage !== undefined && (energyType === 'ELECTRICITY_IT' || energyType === 'ELECTRICITY_EU')) {
    // Apply weighted average based on renewable percentage
    const fossilFactor = adjustedEmissionFactor / (1 - (energyType === 'ELECTRICITY_IT' ? ENERGY_MIX.IT.renewable : ENERGY_MIX.EU.renewable));
    adjustedEmissionFactor = fossilFactor * (1 - renewablePercentage);
  }
  
  // Calculate emissions
  const emissions = adjustedEmissionFactor * standardizedQuantity;
  
  return emissions;
};

/**
 * Calculate CO2 emissions for Scope 3 (other indirect emissions)
 * @param activityType - Type of activity (transport, waste, etc.)
 * @param quantity - Primary quantity (distance, weight, etc.)
 * @param unit - Unit of measurement
 * @param secondaryQuantity - Optional: Secondary quantity (e.g., weight for freight transport)
 * @param secondaryUnit - Optional: Unit for secondary quantity
 * @returns - CO2 emissions in kgCO2e
 */
export const calculateScope3Emissions = (
  activityType: string,
  quantity: number,
  unit: string,
  secondaryQuantity?: number,
  secondaryUnit?: string
): number => {
  // Get the emission factor for the activity type
  const emissionFactor = EMISSION_FACTORS[activityType];
  
  if (!emissionFactor) {
    console.warn(`Emission factor not found for activity type: ${activityType}`);
    return 0;
  }
  
  // Determine the category based on activity type
  let category = 'TRANSPORT';
  if (activityType.startsWith('WASTE')) {
    category = 'WASTE';
  }
  
  // Get the conversion factor for the unit
  const conversionFactor = UNIT_CONVERSIONS[category][unit] || 1;
  
  // Calculate standardized quantity
  let standardizedQuantity = quantity * conversionFactor;
  
  // For freight transport, we need to account for weight and distance
  if (activityType.startsWith('FREIGHT') && secondaryQuantity && secondaryUnit) {
    const secondaryConversionFactor = UNIT_CONVERSIONS.WASTE[secondaryUnit] || 1;
    const standardizedSecondaryQuantity = secondaryQuantity * secondaryConversionFactor;
    standardizedQuantity *= standardizedSecondaryQuantity;
  }
  
  // Calculate emissions
  const emissions = emissionFactor.value * standardizedQuantity;
  
  return emissions;
};

/**
 * Get source information for an emission factor
 * @param factorKey - Key of the emission factor
 * @returns - Source information including name, URL, and reference year
 */
export const getEmissionFactorSource = (factorKey: string) => {
  const factor = EMISSION_FACTORS[factorKey];
  if (!factor) return null;
  
  const sourceUrls = {
    [EmissionFactorSource.IPCC]: 'https://www.ipcc-nggip.iges.or.jp/EFDB/main.php',
    [EmissionFactorSource.DEFRA]: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023',
    [EmissionFactorSource.ISPRA]: 'https://www.isprambiente.gov.it/it/pubblicazioni/manuali-e-linee-guida/fattori-emissione-in-atmosfera'
  };
  
  return {
    name: factor.source,
    url: sourceUrls[factor.source],
    year: '2023' // Update this when using a different reference year
  };
};

/**
 * Get all available fuel types
 */
export const getAvailableFuelTypes = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE1)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Get all available energy types
 */
export const getAvailableEnergyTypes = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE2)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Get all available scope 3 activity types
 */
export const getAvailableScope3Types = (): {value: string, label: string}[] => {
  return Object.entries(EMISSION_FACTORS)
    .filter(([_, factor]) => factor.scope === EmissionScope.SCOPE3)
    .map(([key, factor]) => ({
      value: key,
      label: factor.description
    }));
};

/**
 * Get available units for a specific category
 */
export const getAvailableUnits = (category: 'FUEL' | 'ENERGY' | 'TRANSPORT' | 'WASTE'): {value: string, label: string}[] => {
  return Object.keys(UNIT_CONVERSIONS[category]).map(unit => ({
    value: unit,
    label: unit
  }));
};
