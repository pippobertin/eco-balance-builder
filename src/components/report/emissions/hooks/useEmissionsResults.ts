
import { useEffect } from 'react';
import { useFormValueUpdater } from './useFormValueUpdater';
import { EmissionsResults, EmissionsDetails } from '@/hooks/emissions-calculator';

/**
 * Hook for handling emissions calculation results
 */
export const useEmissionsResults = (
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
) => {
  const { updateFormValues } = useFormValueUpdater(setFormValues);
  
  const handleCalculationResults = (results: EmissionsResults, details: EmissionsDetails) => {
    // This callback runs when calculation results change
    updateFormValues('totalScope1Emissions', results.scope1.toFixed(2));
    updateFormValues('scope1CalculationDetails', details.scope1Details);
    
    updateFormValues('totalScope2Emissions', results.scope2.toFixed(2));
    updateFormValues('scope2CalculationDetails', details.scope2Details);
    
    updateFormValues('totalScope3Emissions', results.scope3.toFixed(2));
    updateFormValues('scope3CalculationDetails', details.scope3Details);
    
    updateFormValues('totalScopeEmissions', results.total.toFixed(2));
  };

  return { handleCalculationResults };
};
