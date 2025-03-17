
import { 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType 
} from '@/lib/emissions-types';

export interface EmissionsResults {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface EmissionsInput {
  // Scope 1 inputs
  scope1Source?: string;
  fuelType?: FuelType;
  fuelQuantity?: string;
  fuelUnit?: string;
  
  // Scope 2 inputs
  energyType?: EnergyType;
  energyQuantity?: string;
  renewablePercentage?: number;
  
  // Scope 3 inputs
  scope3Category?: string;
  transportType?: TransportType;
  transportDistance?: string;
  wasteType?: WasteType;
  wasteQuantity?: string;
  purchaseType?: PurchaseType;
  purchaseQuantity?: string;
  
  // Common inputs
  periodType?: PeriodType;
  calculationMethod?: EmissionFactorSource;
}

export interface EmissionsDetails {
  scope1Details: string;
  scope2Details: string;
  scope3Details: string;
}
