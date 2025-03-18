
import { useState, useEffect } from 'react';
import { useEmissionsCalculator, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
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
  const { 
    handleCalculationResults, 
    handleCalculationLogs,
    calculationLogs,
    resetEmissionsValues 
  } = useEmissionsResults(setFormValues);

  // Use our emissions calculator hook
  const { 
    inputs, 
    updateInput, 
    results, 
    details,
    calculateEmissions, 
    resetCalculation,
    removeCalculation 
  } = useEmissionsCalculator(
    undefined, 
    handleCalculationResults,
    handleCalculationLogs
  );

  // Update local state when calculator results change
  useEffect(() => {
    setCalculatedEmissions(results);
  }, [results]);

  // Listen for the resetEmissions command from the parent component
  useEffect(() => {
    if (formValues && formValues.target && formValues.target.name === 'resetEmissions') {
      // When resetEmissions is triggered, reset the local state
      setCalculatedEmissions({
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0
      });
      
      // Also reset the calculator's internal state
      resetCalculation();
      
      // Explicitly reset the form values
      resetEmissionsValues();
    }
  }, [formValues, resetCalculation, resetEmissionsValues]);

  // Parse existing calculation logs from form values
  useEffect(() => {
    if (formValues?.environmentalMetrics?.emissionCalculationLogs) {
      try {
        const logs = JSON.parse(formValues.environmentalMetrics.emissionCalculationLogs);
        if (logs && typeof logs === 'object') {
          // Set calculation logs
          handleCalculationLogs(logs);
          
          // Calculate totals from logs
          const scope1Total = logs.scope1Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
          const scope2Total = logs.scope2Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
          const scope3Total = logs.scope3Calculations?.reduce((sum: number, calc: any) => sum + (parseFloat(calc.emissions) || 0), 0) || 0;
          const total = scope1Total + scope2Total + scope3Total;
          
          // Update calculated emissions
          setCalculatedEmissions({
            scope1: scope1Total,
            scope2: scope2Total,
            scope3: scope3Total,
            total: total
          });
          
          // Update form values with totals from logs
          updateFormValues('totalScope1Emissions', scope1Total.toFixed(2));
          updateFormValues('totalScope2Emissions', scope2Total.toFixed(2));
          updateFormValues('totalScope3Emissions', scope3Total.toFixed(2));
          updateFormValues('totalScopeEmissions', total.toFixed(2));
        }
      } catch (error) {
        console.error("Error parsing calculation logs:", error);
      }
    }
  }, [formValues?.environmentalMetrics?.emissionCalculationLogs, handleCalculationLogs, updateFormValues]);

  // Monitor existing emissions data
  useExistingEmissions(
    formValues, 
    updateInput, 
    resetCalculation, 
    setCalculatedEmissions
  );

  // Handle removing a specific calculation
  const handleRemoveCalculation = (calculationId: string) => {
    if (removeCalculation) {
      removeCalculation(calculationId);
    }
  };

  // Handle reset button click delegated from EmissionsResults component
  const handleResetClick = () => {
    // Pass the reset request to the parent component
    if (onResetClick) {
      onResetClick();
    }
  };

  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    setCalculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    handleResetClick,
    calculationLogs,
    handleRemoveCalculation
  };
};
