
import { useCalculatorState } from './useCalculatorState';
import { useCalculatorActions } from './useCalculatorActions';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator/useEmissionsCalculator';
import { UseCalculatorResult } from './types';
import { useReport } from '@/hooks/use-report-context';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  onResetClick?: () => void
): UseCalculatorResult => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  // Initialize emissions calculator hook to get inputs and updateInput
  const { inputs, updateInput } = useEmissionsCalculator();
  
  // Get state from state hook
  const {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    setCalculatedEmissions,
    calculationLogs,
    setCalculationLogs,
    isLoading,
    isLoadingExisting
  } = useCalculatorState(reportId);
  
  // Get actions from actions hook
  const {
    calculateEmissions,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving,
    lastSaved
  } = useCalculatorActions(
    reportId,
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
    setCalculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    calculationLogs,
    setCalculationLogs,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving,
    isLoading,
    isLoadingExisting,
    lastSaved
  };
};

export * from './types';
