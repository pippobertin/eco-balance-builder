
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
      console.log('Loading existing emissions:', existingEmissions);
      setCalculatedEmissions(existingEmissions);
    }
    
    if (existingCalculations) {
      console.log('Loading existing calculations:', existingCalculations);
      setCalculationLogs(existingCalculations);
    }
  }, [existingEmissions, existingCalculations]);
  
  // Handle calculation submission
  const handleSubmitCalculation = () => {
    console.log('Submitting calculation...');
    if (reportId) {
      console.log('Report ID:', reportId);
      console.log('Current calculation logs:', calculationLogs);
      saveEmissions(
        reportId,
        calculatedEmissions.scope1,
        calculatedEmissions.scope2,
        calculatedEmissions.scope3,
        calculationLogs
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
    handleSubmitCalculation
  };
};
