
import { useState, useEffect } from 'react';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator';
import { useFormValueUpdater } from './useFormValueUpdater';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { CalculatorState, EmissionsResults } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>> | ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void),
  onResetClick?: () => void
) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>('scope1');
  
  // State for calculated emissions
  const [calculatedEmissions, setCalculatedEmissions] = useState<EmissionsResults>({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // Get toast notification
  const { toast } = useToast();

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
    console.log("Removing calculation in useCalculator:", calculationId);
    
    try {
      if (!calculationId) {
        console.error("No calculation ID provided for removal");
        return;
      }
      
      // Find which scope contains this calculation
      let targetScope: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
      let calculationToRemove = null;
      
      // Check every scope for the calculation
      for (const scope of ['scope1Calculations', 'scope2Calculations', 'scope3Calculations'] as const) {
        const found = calculationLogs[scope].find(calc => calc.id === calculationId);
        if (found) {
          targetScope = scope;
          calculationToRemove = found;
          break;
        }
      }
      
      if (!targetScope || !calculationToRemove) {
        console.error("Calculation not found in any scope:", calculationId);
        console.log("Current logs:", JSON.stringify(calculationLogs));
        return;
      }
      
      console.log(`Found calculation to remove in ${targetScope}:`, calculationToRemove);
      
      // Call the removeCalculation function from the calculator hook
      if (removeCalculation) {
        removeCalculation(calculationId);
        
        // Force immediate update of the form state to ensure changes are saved
        if (calculationLogs) {
          console.log("Updating form after calculation removal");
          
          // Create a new logs object with the calculation removed
          const updatedLogs = { ...calculationLogs };
          updatedLogs[targetScope] = calculationLogs[targetScope].filter(
            calc => calc.id !== calculationId
          );
          
          // Update the form values with the new logs
          updateFormValues('emissionCalculationLogs', JSON.stringify(updatedLogs));
          
          // Also update emission totals
          const scope1Total = updatedLogs.scope1Calculations.reduce((sum, calc) => 
            sum + calc.emissions, 0) || 0;
            
          const scope2Total = updatedLogs.scope2Calculations.reduce((sum, calc) => 
            sum + calc.emissions, 0) || 0;
            
          const scope3Total = updatedLogs.scope3Calculations.reduce((sum, calc) => 
            sum + calc.emissions, 0) || 0;
            
          const total = scope1Total + scope2Total + scope3Total;
          
          // Update local state
          setCalculatedEmissions({
            scope1: scope1Total,
            scope2: scope2Total,
            scope3: scope3Total,
            total: total
          });
          
          // Update emission totals in form
          updateFormValues('totalScope1Emissions', scope1Total.toFixed(2));
          updateFormValues('totalScope2Emissions', scope2Total.toFixed(2));
          updateFormValues('totalScope3Emissions', scope3Total.toFixed(2));
          updateFormValues('totalScopeEmissions', total.toFixed(2));
          
          console.log("Form values updated after removal. New totals:", {
            scope1: scope1Total,
            scope2: scope2Total,
            scope3: scope3Total,
            total
          });
        }
      }
    } catch (error) {
      console.error("Error removing calculation:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la rimozione del calcolo.",
        variant: "destructive"
      });
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
