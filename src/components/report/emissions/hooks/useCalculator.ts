
import { useState } from 'react';
import { useEmissionsCalculator } from '@/hooks/use-emissions-calculator';
import { useFormValueUpdater } from './useFormValueUpdater';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { CalculatorState } from '../types';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  onResetClick?: () => void
) => {
  const [activeTab, setActiveTab] = useState<string>('scope1');

  // Get the form value updater
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  
  // Get emissions results handler
  const { handleCalculationResults } = useEmissionsResults(setFormValues);

  // Use our emissions calculator hook
  const { 
    inputs, 
    updateInput, 
    results: calculatedEmissions, 
    details,
    calculateEmissions, 
    resetCalculation 
  } = useEmissionsCalculator(undefined, handleCalculationResults);

  // Monitor existing emissions data
  useExistingEmissions(formValues, updateInput, resetCalculation);

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
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
