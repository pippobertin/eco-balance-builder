
import { useState } from 'react';
import { useFormValueUpdater } from './useFormValueUpdater';
import { EmissionsResults, EmissionsDetails, EmissionCalculationLogs } from '@/hooks/emissions-calculator';

/**
 * Hook for handling emissions calculation results
 */
export const useEmissionsResults = (
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
) => {
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  const handleCalculationResults = (results: EmissionsResults, details: EmissionsDetails) => {
    // Update form values with the new calculation results
    updateFormValues('totalScope1Emissions', results.scope1.toFixed(2));
    updateFormValues('scope1CalculationDetails', details.scope1Details);
    updateFormValues('totalScope2Emissions', results.scope2.toFixed(2));
    updateFormValues('scope2CalculationDetails', details.scope2Details);
    updateFormValues('totalScope3Emissions', results.scope3.toFixed(2));
    updateFormValues('scope3CalculationDetails', details.scope3Details);
    updateFormValues('totalScopeEmissions', results.total.toFixed(2));
  };

  const handleCalculationLogs = (logs: EmissionCalculationLogs) => {
    setCalculationLogs(logs);
    updateFormValues('emissionCalculationLogs', JSON.stringify(logs));
  };

  // Function to explicitly reset all emissions values
  const resetEmissionsValues = () => {
    // Clear all cache by resetting values to defaults
    updateFormValues('totalScope1Emissions', '0');
    updateFormValues('scope1CalculationDetails', '');
    updateFormValues('totalScope2Emissions', '0');
    updateFormValues('scope2CalculationDetails', '');
    updateFormValues('totalScope3Emissions', '0');
    updateFormValues('scope3CalculationDetails', '');
    updateFormValues('totalScopeEmissions', '0');
    
    // Clear calculation logs
    const emptyLogs = {
      scope1Calculations: [],
      scope2Calculations: [],
      scope3Calculations: []
    };
    updateFormValues('emissionCalculationLogs', JSON.stringify(emptyLogs));
    setCalculationLogs(emptyLogs);
    
    // Clear localStorage cache related to emissions
    try {
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('emissions') || 
        key.includes('scope') || 
        key.includes('calculation')
      );
      
      cacheKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error("Error clearing localStorage cache:", error);
    }
  };

  return { 
    handleCalculationResults,
    handleCalculationLogs,
    calculationLogs,
    resetEmissionsValues 
  };
};
