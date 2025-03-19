
import { useState, useEffect } from 'react';
import { useEmissionsCalculator, EmissionsInput, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { useEmissionsResults } from './useEmissionsResults';
import { useExistingEmissions } from './useExistingEmissions';
import { useReport } from '@/hooks/use-report-context';

export const useCalculator = (
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  onResetClick?: () => void
) => {
  const { currentReport } = useReport();
  const reportId = currentReport?.id;
  
  const [activeTab, setActiveTab] = useState<string>('scope1');
  const [calculatedEmissions, setCalculatedEmissions] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    total: 0
  });
  
  // Get emissions results for saving data
  const { 
    saveEmissions,
    resetEmissions
  } = useEmissionsResults(reportId);
  
  // Initial logs state
  const [calculationLogs, setCalculationLogs] = useState<EmissionCalculationLogs>({
    scope1Calculations: [],
    scope2Calculations: [],
    scope3Calculations: []
  });
  
  // Initialize calculator
  const {
    inputs,
    updateInput,
    results,
    calculateEmissions,
    resetCalculation,
    removeCalculation
  } = useEmissionsCalculator();
  
  // Load existing emissions data
  const { existingEmissions, existingCalculations } = useExistingEmissions(reportId);
  
  // Load existing emissions when available
  useEffect(() => {
    if (existingEmissions) {
      setCalculatedEmissions(existingEmissions);
    }
    
    if (existingCalculations) {
      setCalculationLogs(existingCalculations);
    }
  }, [existingEmissions, existingCalculations]);
  
  // Handle calculation submission
  const handleSubmitCalculation = () => {
    if (reportId) {
      saveEmissions(
        reportId,
        calculatedEmissions.scope1,
        calculatedEmissions.scope2,
        calculatedEmissions.scope3,
        calculationLogs
      );
    }
  };
  
  // Update handleRemoveCalculation to match expected signature
  const handleRemoveCalculation = (calculationId: string) => {
    // Call removeCalculation function with just the ID
    removeCalculation(calculationId);
  };
  
  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions,
    calculationLogs,
    setCalculationLogs,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation
  };
};
