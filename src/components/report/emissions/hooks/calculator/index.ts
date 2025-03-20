
import { useCalculatorState } from './useCalculatorState';
import { useCalculatorActions } from './useCalculatorActions';
import { useCalculatorInputs } from './useCalculatorInputs';

export const useCalculator = (
  formValues: any,
  setFormValues: (values: any) => void,
  onResetClick?: () => void
) => {
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
  
  const { inputs, updateInput } = useCalculatorInputs();
  
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
