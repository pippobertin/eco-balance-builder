
import { useState, useEffect } from 'react';
import { EmissionsInput } from '@/hooks/emissions-calculator/types';
import { FuelType, PeriodType, EnergyType, TransportType } from '@/lib/emissions-types';

interface CalculatorInputs extends EmissionsInput {
  [key: string]: string | number | boolean | undefined;
}

export const useCalculatorInputs = () => {
  // Separate inputs by scope to avoid cross-contamination
  const [inputs, setInputs] = useState<CalculatorInputs>({
    // Scope 1 defaults
    scope1Source: 'fuel',
    fuelType: 'DIESEL' as FuelType,
    fuelUnit: 'L',
    fuelQuantity: '',
    
    // Scope 2 defaults
    energyType: 'ELECTRICITY_IT' as EnergyType,
    energyQuantity: '',
    renewablePercentage: 0,
    energyProvider: '',
    
    // Scope 3 defaults
    scope3Category: 'transport',
    transportType: 'BUSINESS_TRAVEL_CAR' as TransportType,
    transportDistance: '',
    wasteType: 'WASTE_LANDFILL',
    wasteQuantity: '',
    purchaseType: 'PURCHASED_GOODS',
    purchaseQuantity: '',
    purchaseDescription: '',
    
    // Vehicle details for Scope 3
    vehicleType: 'car_medium',
    vehicleFuelType: 'DIESEL' as FuelType,
    vehicleEnergyClass: 'euro6',
    vehicleFuelConsumption: '',
    vehicleFuelConsumptionUnit: 'l_100km',
    
    // Common defaults
    periodType: PeriodType.ANNUAL
  });

  // Function to update a specific input field with proper type handling
  const updateInput = (name: string, value: string | number | boolean) => {
    console.log(`Updating input '${name}' to:`, value);
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  // Log inputs whenever they change (for debugging)
  useEffect(() => {
    console.log('Current calculator inputs:', inputs);
  }, [inputs]);

  return {
    inputs,
    updateInput
  };
};
