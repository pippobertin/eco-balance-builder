
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
    isSaving,
    lastSaved
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
  
  // Debug log to track the state of calculation logs
  useEffect(() => {
    console.log('Current calculation logs state:', calculationLogs);
    console.log('Scope1 calculations count:', calculationLogs.scope1Calculations?.length || 0);
    console.log('Scope2 calculations count:', calculationLogs.scope2Calculations?.length || 0);
    console.log('Scope3 calculations count:', calculationLogs.scope3Calculations?.length || 0);
  }, [calculationLogs]);
  
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
      const updatedLogs = {
        scope1Calculations: prevLogs.scope1Calculations.filter(calc => calc.id !== calculationId),
        scope2Calculations: prevLogs.scope2Calculations.filter(calc => calc.id !== calculationId),
        scope3Calculations: prevLogs.scope3Calculations.filter(calc => calc.id !== calculationId)
      };
      
      console.log('Updated logs after removal:', updatedLogs);
      
      // After removing, recalculate totals
      updateEmissionTotals(updatedLogs);
      
      return updatedLogs;
    });
  };
  
  // Calculate totals from the calculation logs
  const updateEmissionTotals = (logs = calculationLogs) => {
    const scope1Total = logs.scope1Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope2Total = logs.scope2Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope3Total = logs.scope3Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const total = scope1Total + scope2Total + scope3Total;
    
    console.log('Updating emission totals:', { scope1Total, scope2Total, scope3Total, total });
    
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
    console.log('Calculation details:', newDetails);
    
    if (newDetails) {
      // Update calculation logs with the new calculation
      setCalculationLogs(prevLogs => {
        let updatedLogs: EmissionCalculationLogs;
        
        if (scope === 'scope1') {
          updatedLogs = {
            ...prevLogs,
            scope1Calculations: [
              ...prevLogs.scope1Calculations,
              newDetails
            ]
          };
        } else if (scope === 'scope2') {
          updatedLogs = {
            ...prevLogs,
            scope2Calculations: [
              ...prevLogs.scope2Calculations,
              newDetails
            ]
          };
        } else { // scope3
          updatedLogs = {
            ...prevLogs,
            scope3Calculations: [
              ...prevLogs.scope3Calculations,
              newDetails
            ]
          };
        }
        
        console.log('Updated calculation logs:', updatedLogs);
        
        // Update the emission totals based on the updated logs
        updateEmissionTotals(updatedLogs);
        
        return updatedLogs;
      });
    }
    
    // Update the calculatedEmissions state directly from the calculation results
    setCalculatedEmissions(prev => ({
      ...prev,
      scope1: newResults.scope1,
      scope2: newResults.scope2,
      scope3: newResults.scope3,
      total: newResults.scope1 + newResults.scope2 + newResults.scope3
    }));
    
    // Don't save immediately - this will be done when the user clicks the submit button
    console.log('Updated calculated emissions:', newResults);
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
    isLoadingExisting,
    lastSaved
  };
};
