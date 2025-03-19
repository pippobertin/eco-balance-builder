
import { useState } from 'react';
import { EmissionFactorSource, PeriodType } from '@/lib/emissions-types';
import { EmissionsInput } from '@/hooks/emissions-calculator/types';

export const useCalculatorInputs = () => {
  // Default input values
  const defaultInputs: EmissionsInput = {
    // Common inputs
    calculationMethod: EmissionFactorSource.DEFRA,
    periodType: PeriodType.ANNUAL,
    
    // Scope 1
    scope1Source: 'fuel',
    fuelType: 'DIESEL',
    fuelQuantity: '',
    fuelUnit: 'L',
    
    // Scope 2
    energyType: 'ELECTRICITY_IT',
    energyQuantity: '',
    renewablePercentage: 0,
    energyProvider: '',
    
    // Scope 3
    scope3Category: 'transport',
    transportType: 'BUSINESS_TRAVEL_CAR',
    transportDistance: '',
    wasteType: 'WASTE_LANDFILL',
    wasteQuantity: '',
    purchaseType: 'PURCHASED_GOODS',
    purchaseQuantity: '',
    purchaseDescription: '',
    
    // Vehicle details
    vehicleType: '',
    vehicleFuelType: 'DIESEL',
    vehicleEnergyClass: '',
    vehicleFuelConsumption: '',
    vehicleFuelConsumptionUnit: 'l_100km'
  };
  
  // State for inputs
  const [inputs, setInputs] = useState<EmissionsInput>(defaultInputs);
  
  // Update a specific input
  const updateInput = <K extends keyof EmissionsInput>(
    key: K, 
    value: EmissionsInput[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  return {
    inputs,
    updateInput,
    resetInputs: () => setInputs(defaultInputs)
  };
};
