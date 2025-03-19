
import { useState, useEffect } from 'react';
import { useEmissionsCalculator, EmissionsInput, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { useEmissionsResults } from './emissions-results';
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
    resetEmissions,
    isSaving
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
  const { existingEmissions, existingCalculations, isLoading: isLoadingExisting } = useExistingEmissions(reportId);
  
  // Load existing emissions when available
  useEffect(() => {
    if (existingEmissions) {
      console.log('Loading existing emissions:', existingEmissions);
      setCalculatedEmissions(existingEmissions);
    }
    
    if (existingCalculations) {
      console.log('Loading existing calculations:', existingCalculations);
      
      // Ensure we have valid arrays for each scope
      const validatedCalculations: EmissionCalculationLogs = {
        scope1Calculations: Array.isArray(existingCalculations.scope1Calculations) 
          ? existingCalculations.scope1Calculations : [],
        scope2Calculations: Array.isArray(existingCalculations.scope2Calculations)
          ? existingCalculations.scope2Calculations : [],
        scope3Calculations: Array.isArray(existingCalculations.scope3Calculations)
          ? existingCalculations.scope3Calculations : []
      };
      
      console.log('Validated calculation logs:', validatedCalculations);
      setCalculationLogs(validatedCalculations);
    }
  }, [existingEmissions, existingCalculations]);
  
  // Handle calculation submission
  const handleSubmitCalculation = () => {
    console.log('Submitting calculation...');
    if (reportId) {
      console.log('Report ID:', reportId);
      console.log('Current calculation logs:', calculationLogs);
      
      // Make sure we have valid logs before saving
      const validatedCalculations: EmissionCalculationLogs = {
        scope1Calculations: Array.isArray(calculationLogs.scope1Calculations) 
          ? calculationLogs.scope1Calculations : [],
        scope2Calculations: Array.isArray(calculationLogs.scope2Calculations)
          ? calculationLogs.scope2Calculations : [],
        scope3Calculations: Array.isArray(calculationLogs.scope3Calculations)
          ? calculationLogs.scope3Calculations : []
      };
      
      saveEmissions(
        reportId,
        calculatedEmissions.scope1,
        calculatedEmissions.scope2,
        calculatedEmissions.scope3,
        validatedCalculations
      );
    } else {
      console.error('Cannot submit calculation: reportId is undefined');
    }
  };

  // Update handleRemoveCalculation to match expected signature
  const handleRemoveCalculation = (calculationId: string) => {
    console.log('Removing calculation:', calculationId);
    // Call removeCalculation function with just the ID
    removeCalculation(calculationId);
    
    // Also update our local state by filtering out the removed calculation
    setCalculationLogs(prevLogs => {
      return {
        scope1Calculations: prevLogs.scope1Calculations.filter(calc => calc.id !== calculationId),
        scope2Calculations: prevLogs.scope2Calculations.filter(calc => calc.id !== calculationId),
        scope3Calculations: prevLogs.scope3Calculations.filter(calc => calc.id !== calculationId)
      };
    });
    
    // After removing, recalculate totals
    updateEmissionTotals();
  };
  
  // Calculate totals from the calculation logs
  const updateEmissionTotals = () => {
    const scope1Total = calculationLogs.scope1Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope2Total = calculationLogs.scope2Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope3Total = calculationLogs.scope3Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const total = scope1Total + scope2Total + scope3Total;
    
    setCalculatedEmissions({
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total
    });
  };

  // This function calculates emissions for the current tab and updates the state
  const handleCalculateEmissions = (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Calculating emissions for ${scope}...`);
    console.log('Inputs:', inputs);
    
    // Calculate emissions using the emissions calculator
    const { results: newResults, details: newDetails } = calculateEmissions(scope);
    console.log('Calculation results:', newResults);
    
    // Create updated logs
    let updatedLogs = { ...calculationLogs };
    
    // Update calculation logs if we have a new calculation
    const emissionValue = 
      scope === 'scope1' ? newResults.scope1 : 
      scope === 'scope2' ? newResults.scope2 : newResults.scope3;
    
    // Update the calculatedEmissions state which feeds into the UI
    setCalculatedEmissions(prev => ({
      ...prev,
      [scope]: emissionValue,
      total: prev.scope1 + prev.scope2 + prev.scope3 + 
        (scope === 'scope1' ? emissionValue - prev.scope1 : 0) +
        (scope === 'scope2' ? emissionValue - prev.scope2 : 0) +
        (scope === 'scope3' ? emissionValue - prev.scope3 : 0)
    }));
    
    // Don't save immediately - this will be done when the user clicks the submit button
    console.log('Updated calculated emissions:', calculatedEmissions);
  };
  
  return {
    activeTab,
    setActiveTab,
    calculatedEmissions,
    inputs,
    updateInput,
    calculateEmissions: handleCalculateEmissions,
    calculationLogs,
    setCalculationLogs,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving,
    isLoadingExisting
  };
};
