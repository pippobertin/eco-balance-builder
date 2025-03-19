
import { 
  EmissionFactorSource, 
  PeriodType, 
  FuelType, 
  EnergyType, 
  TransportType, 
  WasteType, 
  PurchaseType 
} from '@/lib/emissions-types';

/**
 * Input types for the emissions calculator
 */

export interface Scope1Input {
  scope1Source?: string;
  fuelType?: FuelType;
  fuelQuantity?: string;
  fuelUnit?: string;
}

export interface Scope2Input {
  energyType?: EnergyType;
  energyQuantity?: string;
  renewablePercentage?: number;
  energyProvider?: string;
}

export interface Scope3Input {
  scope3Category?: string;
  transportType?: TransportType;
  transportDistance?: string;
  wasteType?: WasteType;
  wasteQuantity?: string;
  purchaseType?: PurchaseType;
  purchaseQuantity?: string;
  purchaseDescription?: string; // New field for purchase description
  
  // Vehicle details for Scope 3 transport
  vehicleType?: string;
  vehicleFuelType?: FuelType;
  vehicleEnergyClass?: string;
}

export interface CommonInput {
  periodType?: PeriodType;
  calculationMethod?: EmissionFactorSource;
}

export interface EmissionsInput extends Scope1Input, Scope2Input, Scope3Input, CommonInput {}
