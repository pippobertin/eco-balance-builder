
// Re-export types from new modular type files
export * from './types/common';
export * from './types/inputs';
export * from './types/records';

export interface EmissionsInput {
  // Scope 1 inputs
  scope1Source?: string;
  fuelType?: string;
  fuelQuantity?: string;
  fuelUnit?: string;
  
  // Scope 2 inputs
  energyType?: string;
  energyQuantity?: string;
  renewablePercentage?: number;
  energyProvider?: string;
  
  // Scope 3 inputs
  scope3Category?: string;
  transportType?: string;
  transportDistance?: string;
  wasteType?: string;
  wasteQuantity?: string;
  purchaseType?: string;
  purchaseQuantity?: string;
  purchaseDescription?: string;
  vehicleType?: string;
  vehicleFuelType?: string;
  vehicleEnergyClass?: string;
  vehicleFuelConsumption?: string;
  vehicleFuelConsumptionUnit?: string;
  
  // Common inputs
  periodType?: string;
  calculationMethod?: string;
  reportId?: string;
}
