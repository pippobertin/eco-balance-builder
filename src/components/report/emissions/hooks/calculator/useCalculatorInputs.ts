
import { useState, useEffect } from 'react';
import { EmissionsInput } from '@/hooks/emissions-calculator/types';
import { FuelType, PeriodType } from '@/lib/emissions-types';

interface CalculatorInputs extends EmissionsInput {
  [key: string]: string | number | boolean | undefined;
}

export const useCalculatorInputs = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    // Initialize with default values
    scope1Source: 'fuel',
    fuelType: 'DIESEL' as FuelType,
    fuelUnit: 'L',
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
