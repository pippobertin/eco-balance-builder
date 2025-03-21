
import { useState, useEffect, useRef } from 'react';
import { useCalculatorState } from './calculator/useCalculatorState';
import { useCalculatorActions } from './calculator/useCalculatorActions';
import { useCalculatorInputs } from './calculator/useCalculatorInputs';
import { useReport } from '@/hooks/use-report-context';

export const useCalculator = (
  formValues: any,
  setFormValues: (values: any) => void,
  onResetClick: () => void
) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  // Add a ref to track previous emissions values to avoid unnecessary updates
  const prevEmissionsRef = useRef<any>(null);
  const prevLogsRef = useRef<any>(null);
  
  // Initialize calculator state
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    setCalculatedEmissions,
    calculationLogs,
    setCalculationLogs,
    isLoading,
    isLoadingExisting,
    isSaving, 
    lastSaved
  } = useCalculatorState(reportId);
  
  // Initialize inputs state
  const { inputs, updateInput } = useCalculatorInputs();
  
  // Initialize calculator actions
  const {
    calculateEmissions,
    updateCalculation,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation
  } = useCalculatorActions(
    reportId,
    inputs,
    updateInput,
    calculationLogs,
    setCalculationLogs,
    calculatedEmissions,
    setCalculatedEmissions
  );
  
  // Update form values when emissions change, but only if they actually changed
  useEffect(() => {
    // Function to check if emissions have actually changed
    const haveEmissionsChanged = () => {
      if (!prevEmissionsRef.current) return true;
      
      return (
        calculatedEmissions.total !== prevEmissionsRef.current.total ||
        calculatedEmissions.scope1 !== prevEmissionsRef.current.scope1 ||
        calculatedEmissions.scope2 !== prevEmissionsRef.current.scope2 ||
        calculatedEmissions.scope3 !== prevEmissionsRef.current.scope3
      );
    };
    
    // Function to check if logs have actually changed
    const haveLogsChanged = () => {
      if (!prevLogsRef.current) return true;
      
      const scope1Changed = (calculationLogs.scope1Calculations?.length || 0) !== 
                           (prevLogsRef.current.scope1Calculations?.length || 0);
      const scope2Changed = (calculationLogs.scope2Calculations?.length || 0) !== 
                           (prevLogsRef.current.scope2Calculations?.length || 0);
      const scope3Changed = (calculationLogs.scope3Calculations?.length || 0) !== 
                           (prevLogsRef.current.scope3Calculations?.length || 0);
      
      return scope1Changed || scope2Changed || scope3Changed;
    };
    
    // Only update if we have meaningful data AND the values have actually changed
    if ((calculatedEmissions.total > 0 || 
        (calculationLogs.scope1Calculations && calculationLogs.scope1Calculations.length > 0) ||
        (calculationLogs.scope2Calculations && calculationLogs.scope2Calculations.length > 0) ||
        (calculationLogs.scope3Calculations && calculationLogs.scope3Calculations.length > 0)) && 
        (haveEmissionsChanged() || haveLogsChanged())) {
      
      console.log('Updating form values with calculated emissions:', calculatedEmissions);
      console.log('Calculation logs when updating form:', {
        scope1Count: calculationLogs.scope1Calculations?.length || 0,
        scope2Count: calculationLogs.scope2Calculations?.length || 0,
        scope3Count: calculationLogs.scope3Calculations?.length || 0
      });
      
      setFormValues({
        ...formValues,
        environmentalMetrics: {
          ...formValues.environmentalMetrics,
          totalScope1Emissions: calculatedEmissions.scope1,
          totalScope2Emissions: calculatedEmissions.scope2,
          totalScope3Emissions: calculatedEmissions.scope3,
          totalEmissions: calculatedEmissions.total,
          emissionCalculationLogs: calculationLogs
        }
      });
      
      // Update refs with current values to use in the next comparison
      prevEmissionsRef.current = { ...calculatedEmissions };
      prevLogsRef.current = {
        scope1Calculations: [...(calculationLogs.scope1Calculations || [])],
        scope2Calculations: [...(calculationLogs.scope2Calculations || [])],
        scope3Calculations: [...(calculationLogs.scope3Calculations || [])]
      };
    }
  }, [calculatedEmissions, calculationLogs, formValues, setFormValues]);
  
  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculationLogs,
    calculateEmissions,
    updateCalculation,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isLoading,
    isLoadingExisting,
    isSaving,
    lastSaved
  };
};
