// Enum for emission scopes
export enum EmissionScope {
  SCOPE1 = 'Scope 1',
  SCOPE2 = 'Scope 2',
  SCOPE3 = 'Scope 3'
}

// Enum for emission factor sources
export enum EmissionFactorSource {
  IPCC = 'IPCC',
  DEFRA = 'DEFRA',
  ISPRA = 'ISPRA'
}

// Enum for period types
export enum PeriodType {
  ANNUAL = 'ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY'
}

// Emission factor interface
export interface EmissionFactor {
  value: number;
  unit: string;
  source: EmissionFactorSource;
  scope: EmissionScope;
  description: string;
}

// Base interface for emission sources
export interface BaseEmissionSource {
  id: string;
  type: 'scope1' | 'scope2' | 'scope3';
  name?: string;
  description?: string;
  quantity: number;
  unit: string;
  periodType?: PeriodType;
  periodValue?: number;
  calculationDate?: string;
  emissionsKg?: number;
  emissionsTonnes?: number;
  source?: {
    name: string;
    url: string;
    year: string;
  };
}

// Scope 1 Emissions Source - Direct Emissions
export interface Scope1EmissionSource extends BaseEmissionSource {
  type: 'scope1';
  fuelType: FuelType;
  category?: 'production' | 'fleet' | 'other';
  vehicleType?: string;
  fuelConsumption?: number;
  kilometers?: number;
}

// Scope 2 Emissions Source - Indirect Energy Emissions
export interface Scope2EmissionSource extends BaseEmissionSource {
  type: 'scope2';
  energyType: EnergyType;
  renewablePercentage?: number;
  provider?: string;
  location?: string;
}

// Scope 3 Emissions Source - Other Indirect Emissions
export interface Scope3EmissionSource extends BaseEmissionSource {
  type: 'scope3';
  activityType: string;
  category?: 'transport' | 'purchases' | 'waste' | 'other';
  transportType?: string;
  vehicleType?: string;
  secondaryQuantity?: number;
  secondaryUnit?: string;
  productType?: string;
  wasteType?: string;
  disposalMethod?: string;
}

// Union type for any emission source
export type EmissionSource = Scope1EmissionSource | Scope2EmissionSource | Scope3EmissionSource;

// Type for fuel types (Scope 1)
export type FuelType = 
  'DIESEL' | 
  'GASOLINE' | 
  'NATURAL_GAS' | 
  'LPG' | 
  'BIOMASS_PELLET' | 
  'BIOMASS_WOOD' | 
  'BIOFUEL' | 
  'COAL' | 
  'FUEL_OIL' |
  'HYBRID' |
  'ELECTRIC';

// Type for energy types (Scope 2)
export type EnergyType = 
  'ELECTRICITY_IT' | 
  'ELECTRICITY_EU' | 
  'ELECTRICITY_RENEWABLE' | 
  'ELECTRICITY_COGENERATION';

// Type for transport types (Scope 3)
export type TransportType = 
  'FREIGHT_ROAD' | 
  'FREIGHT_RAIL' | 
  'FREIGHT_SEA' | 
  'FREIGHT_AIR' | 
  'BUSINESS_TRAVEL_CAR' | 
  'BUSINESS_TRAVEL_TRAIN' | 
  'BUSINESS_TRAVEL_FLIGHT_SHORT' | 
  'BUSINESS_TRAVEL_FLIGHT_LONG';

// Type for waste types (Scope 3)
export type WasteType = 
  'WASTE_LANDFILL' | 
  'WASTE_RECYCLED' | 
  'WASTE_INCINERATION';

// Type for purchased goods and services (Scope 3)
export type PurchaseType = 
  'PURCHASED_GOODS' | 
  'PURCHASED_SERVICES';

// Interfacce per l'input utente
export interface EmissionsCalculationInput {
  scope1Sources: Scope1EmissionSource[];
  scope2Sources: Scope2EmissionSource[];
  scope3Sources: Scope3EmissionSource[];
  totalScope1Emissions: number;
  totalScope2Emissions: number;
  totalScope3Emissions: number;
  totalEmissions: number;
  calculationDate: string;
}
