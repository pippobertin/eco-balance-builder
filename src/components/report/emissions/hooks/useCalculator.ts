
import { useState, useEffect } from 'react';
import { useEmissionsCalculator } from '@/hooks/use-emissions-calculator';
import { useFormValueUpdater } from './useFormValueUpdater';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { CalculatorState, EmissionsResults } from '../types';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  onResetClick?: () => void
) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');
  const [calculatedEmissions, setCalculatedEmissions] = useState<EmissionsResults>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });

  // Get the form value updater
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  
  // Get emissions results handler
  const { handleCalculationResults } = useEmissionsResults(setFormValues);

  // Use our emissions calculator hook
  const { 
    inputs, 
    updateInput, 
    results, 
    details,
    calculateEmissions, 
    resetCalculation 
  } = useEmissionsCalculator(undefined, handleCalculationResults);

  // Update local state when calculator results change
  useEffect(() => {
    setCalculatedEmissions(results);
  }, [results]);

  // Monitor existing emissions data
  useExistingEmissions(
    formValues, 
    updateInput, 
    resetCalculation, 
    setCalculatedEmissions
  );

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    // First, reset the local state
    setCalculatedEmissions({
      scope1: 0,
      scope2: 0,
      scope3: 0,
      total: 0
    });
    
    // Then, call the resetCalculation from the calculator hook
    resetCalculation();
    
    // Finally, if there's an external reset handler, call it
    if (onResetClick) {
      onResetClick();
    }
  };

  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    handleResetClick
  };
};
