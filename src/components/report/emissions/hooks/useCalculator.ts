
import { useState, useEffect } from 'react';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator';
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
        const logsString = formValues.environmentalMetrics.emissionCalculationLogs;
        if (typeof logsString !== 'string') return;
        
        const logs = JSON.parse(logsString);
        if (logs && typeof logs === 'object') {
          console.log("Loaded calculation logs:", logs);
          
          // Ensure all logs have valid IDs
          const ensureLogIds = (logs: any) => {
            if (!logs) return logs;
            
            // Process each scope
            ['scope1Calculations', 'scope2Calculations', 'scope3Calculations'].forEach(scope => {
              if (Array.isArray(logs[scope])) {
                logs[scope] = logs[scope].map((calc: any) => {
                  // If calculation doesn't have id, add one
                  if (!calc.id) {
                    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    return { ...calc, id };
                  }
                  return calc;
                });
              } else {
                logs[scope] = [];
              }
            });
            
            return logs;
          };
          
          // Ensure all logs have valid IDs
          const validatedLogs = ensureLogIds(logs);
          
          // Set calculation logs
          handleCalculationLogs(validatedLogs);
          
          // Calculate totals from logs
          const scope1Total = validatedLogs.scope1Calculations?.reduce((sum: number, calc: any) => 
            sum + (parseFloat(calc.emissions) || 0), 0) || 0;
            
          const scope2Total = validatedLogs.scope2Calculations?.reduce((sum: number, calc: any) => 
            sum + (parseFloat(calc.emissions) || 0), 0) || 0;
            
          const scope3Total = validatedLogs.scope3Calculations?.reduce((sum: number, calc: any) => 
            sum + (parseFloat(calc.emissions) || 0), 0) || 0;
            
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
    console.log("Removing calculation:", calculationId);
    
    if (removeCalculation) {
      removeCalculation(calculationId);
      
      // Immediately update the form state to ensure changes are saved
      if (formValues?.environmentalMetrics?.emissionCalculationLogs && calculationLogs) {
        console.log("Updating form after calculation removal");
        
        // Get the latest logs after removal
        updateFormValues('emissionCalculationLogs', JSON.stringify(calculationLogs));
        
        // Also update emission totals
        const scope1Total = calculationLogs.scope1Calculations?.reduce((sum, calc) => 
          sum + calc.emissions, 0) || 0;
          
        const scope2Total = calculationLogs.scope2Calculations?.reduce((sum, calc) => 
          sum + calc.emissions, 0) || 0;
          
        const scope3Total = calculationLogs.scope3Calculations?.reduce((sum, calc) => 
          sum + calc.emissions, 0) || 0;
          
        const total = scope1Total + scope2Total + scope3Total;
        
        // Update emission totals in form
        updateFormValues('totalScope1Emissions', scope1Total.toFixed(2));
        updateFormValues('totalScope2Emissions', scope2Total.toFixed(2));
        updateFormValues('totalScope3Emissions', scope3Total.toFixed(2));
        updateFormValues('totalScopeEmissions', total.toFixed(2));
      }
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
    calculationLogs,
    handleRemoveCalculation
  };
};
