
import { useState } from 'react';
import { EmissionsInput, EmissionsResults, EmissionsDetails } from './types';
import { performEmissionsCalculation } from './calculations';
import { createDefaultInputs, resetQuantityInputs } from './input-handlers';

// Use 'export type' for type exports when isolatedModules is enabled
export { useEmissionsCalculator };
export type { EmissionsInput, EmissionsResults, EmissionsDetails };

const useEmissionsCalculator = (
  initialInputs?: EmissionsInput,
  onResultsChange?: (results: EmissionsResults, details: EmissionsDetails) => void
) => {
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
  
  // Input change handlers
  const updateInput = <K extends keyof EmissionsInput>(key: K, value: EmissionsInput[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };
  
  // Calculation function
  const calculateEmissions = (scope?: 'scope1' | 'scope2' | 'scope3') => {
    const { results: newResults, details: newDetails } = performEmissionsCalculation(inputs, scope);
    
    // Update state
    setResults(newResults);
    setDetails(newDetails);
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  };
  
  // Reset calculation
  const resetCalculation = () => {
    // Reset results
    const newResults = {
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    };
    
    const newDetails = {
      scope1Details: '',
      scope2Details: '',
      scope3Details: ''
    };
    
    setResults(newResults);
    setDetails(newDetails);
    
    // Reset input fields that contain quantities
    setInputs(resetQuantityInputs(inputs));
    
    // Call callback if provided
    if (onResultsChange) {
      onResultsChange(newResults, newDetails);
    }
    
    return { results: newResults, details: newDetails };
  };
  
  return {
    inputs,
    updateInput,
    results,
    details,
    calculateEmissions,
    resetCalculation
  };
};
