
import { useState } from 'react';
import { EmissionsInput } from '@/hooks/emissions-calculator/types';

interface CalculatorInputs extends EmissionsInput {
  [key: string]: string | number | boolean | undefined;
}

export const useCalculatorInputs = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({});

  // Function to update a specific input field with proper type handling
  const updateInput = (name: string, value: string | number | boolean) => {
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  return {
    inputs,
    updateInput
  };
};
