
import { EmissionsInput } from './types';
import { PeriodType, EmissionFactorSource } from '@/lib/emissions-types';

// Helper function to create default inputs
export const createDefaultInputs = (): EmissionsInput => {
  return {
    scope1Source: 'fuel',
    fuelType: 'DIESEL',
    fuelQuantity: '',
    fuelUnit: 'L',
    energyType: 'ELECTRICITY_IT',
    energyQuantity: '',
    renewablePercentage: 0,
    scope3Category: 'transport',
    transportType: 'BUSINESS_TRAVEL_CAR',
    transportDistance: '',
    wasteType: 'WASTE_LANDFILL',
    wasteQuantity: '',
    purchaseType: 'PURCHASED_GOODS',
    purchaseQuantity: '',
    periodType: PeriodType.ANNUAL,
    calculationMethod: EmissionFactorSource.DEFRA
  };
};

// Helper function to reset quantity inputs
export const resetQuantityInputs = (currentInputs: EmissionsInput): EmissionsInput => {
  return {
    ...currentInputs,
    fuelQuantity: '',
    energyQuantity: '',
    transportDistance: '',
    wasteQuantity: '',
    purchaseQuantity: ''
  };
};
