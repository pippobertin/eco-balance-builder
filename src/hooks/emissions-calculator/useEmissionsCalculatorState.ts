import { useState } from 'react';
import { EmissionsInput, EmissionsResults, EmissionsDetails, EmissionCalculationLogs } from './types';
import { createDefaultInputs, resetQuantityInputs } from './input-handlers';

/**
 * Hook for managing the state of the emissions calculator
 */
export const useEmissionsCalculatorState = (initialInputs?: EmissionsInput) => {
  // State for inputs with default values
  const [inputs, setInputs] = useState<EmissionsInput>(initialInputs || createDefaultInputs());
  
  // State for calculation results
  const [results, setResults] = useState<EmissionsResults>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // State for calculation details
  const [details, setDetails] = useState<EmissionsDetails>({
    scope1Details: '',
    scope2Details: '',
    scope3Details: ''
  });
  
  // State for calculation logs
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  // Input change handlers
  const updateInput = <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  // Reset quantity inputs but keep other settings
  const resetInputs = () => {
    setInputs(resetQuantityInputs(inputs));
  };

  return {
    inputs,
    setInputs,
    updateInput,
    resetInputs,
    results,
    setResults,
    details,
    setDetails,
    calculationLogs,
    setCalculationLogs
  };
};
