
import { useState } from 'react';

interface CalculatorInputs {
  [key: string]: string | number;
}

export const useCalculatorInputs = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>({});

  // Function to update a specific input field
  const updateInput = (name: string, value: string | number) => {
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
