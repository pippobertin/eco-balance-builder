
import { useState, useEffect } from 'react';
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
  
  // Update form values when emissions change
  useEffect(() => {
    // Only update if we have meaningful data
    if (calculatedEmissions.total > 0 || 
        (calculationLogs.scope1Calculations && calculationLogs.scope1Calculations.length > 0) ||
        (calculationLogs.scope2Calculations && calculationLogs.scope2Calculations.length > 0) ||
        (calculationLogs.scope3Calculations && calculationLogs.scope3Calculations.length > 0)) {
      
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
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isLoading,
    isLoadingExisting,
    isSaving,
    lastSaved
  };
};
