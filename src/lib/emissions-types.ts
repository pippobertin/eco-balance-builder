
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

// Emission factor interface
export interface EmissionFactor {
  value: number;
  unit: string;
  source: EmissionFactorSource;
  scope: EmissionScope;
  description: string;
}

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
  'FUEL_OIL';

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

// Interface for Scope 1 data
export interface Scope1Data {
  fuelType: FuelType;
  quantity: number;
  unit: string;
  periodType?: PeriodType;
  periodValue?: number;
}

// Interface for Scope 2 data
export interface Scope2Data {
  energyType: EnergyType;
  quantity: number;
  unit: string;
  renewablePercentage?: number;
  periodType?: PeriodType;
  periodValue?: number;
}

// Interface for Scope 3 data
export interface Scope3Data {
  activityType: string;
  quantity: number;
  unit: string;
  secondaryQuantity?: number;
  secondaryUnit?: string;
  periodType?: PeriodType;
  periodValue?: number;
}

// Type for time period
export type PeriodType = 'ANNUAL' | 'QUARTERLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
