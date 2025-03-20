
import { useCalculatorState } from './useCalculatorState';
import { useCalculatorActions } from './useCalculatorActions';
import { useCalculatorInputs } from './useCalculatorInputs';

export const useCalculator = (
  formValues: any,
  setFormValues: (values: any) => void,
  onResetClick?: () => void
) => {
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
  } = useCalculatorState(formValues?.reportId);
  
  // Initialize inputs state
  const { inputs, updateInput } = useCalculatorInputs();
  
  // Initialize calculator actions
  const {
    calculateEmissions,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation
  } = useCalculatorActions(
    formValues?.reportId,
    inputs,
    updateInput,
    calculationLogs,
    setCalculationLogs,
    calculatedEmissions,
    setCalculatedEmissions
  );
  
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
