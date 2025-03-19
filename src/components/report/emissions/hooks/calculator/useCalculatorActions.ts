
import { useEmissionsCalculator } from '@/hooks/emissions-calculator';
import { EmissionCalculationRecord, EmissionCalculationLogs } from '@/hooks/emissions-calculator';
import { useEmissionsResults } from '../emissions-results';
import { useEmissionCalculations } from './useEmissionCalculations';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: any,
  updateInput: any,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: React.Dispatch<React.SetStateAction<EmissionCalculationLogs>>,
  calculatedEmissions: { scope1: number; scope2: number; scope3: number; total: number },
  setCalculatedEmissions: React.Dispatch<React.SetStateAction<{ scope1: number; scope2: number; scope3: number; total: number }>>
) => {
  // Get emissions results for saving data
  const { 
    saveEmissions,
    resetEmissions,
    isSaving,
    lastSaved
  } = useEmissionsResults(reportId);

  // Initialize emissions calculator
  const {
    calculateEmissions: calculateEmissionsHook,
    resetCalculation: resetCalculationHook,
    removeCalculation: removeCalculationHook
  } = useEmissionsCalculator();
  
  // Utility functions for emission calculations
  const { updateEmissionTotals, generateId } = useEmissionCalculations(
    calculationLogs,
    setCalculationLogs,
    calculatedEmissions,
    setCalculatedEmissions
  );
  
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

  // Handle removing a calculation from the logs
  const handleRemoveCalculation = (calculationId: string) => {
    console.log('Removing calculation:', calculationId);
    
    // Call removeCalculation function with both required arguments
    removeCalculationHook(calculationId, calculationLogs);
    
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

  // This function calculates emissions for the current tab and updates the state
  const handleCalculateEmissions = (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Calculating emissions for ${scope}...`);
    console.log('Inputs:', inputs);
    
    // Calculate emissions using the emissions calculator
    const { results: newResults, details: newDetails } = calculateEmissionsHook(scope);
    console.log('Calculation results:', newResults);
    console.log('Calculation details:', newDetails);
    
    if (newDetails) {
      // Update calculation logs with the new calculation
      setCalculationLogs(prevLogs => {
        let updatedLogs: EmissionCalculationLogs;
        
        // Create a properly formatted EmissionCalculationRecord from the details
        const detailsObj = scope === 'scope1' ? 
          JSON.parse(newDetails.scope1Details || '{}') : 
          scope === 'scope2' ? 
            JSON.parse(newDetails.scope2Details || '{}') : 
            JSON.parse(newDetails.scope3Details || '{}');
        
        // Convert the details to the correct EmissionCalculationRecord format
        const calculationRecord: EmissionCalculationRecord = {
          id: detailsObj.id || generateId(),
          date: detailsObj.date || new Date().toISOString(),
          source: detailsObj.source || scope,
          scope: scope,
          description: detailsObj.description || `${scope} calculation`,
          quantity: detailsObj.quantity || 0,
          unit: detailsObj.unit || '',
          emissions: scope === 'scope1' ? newResults.scope1 : 
                    scope === 'scope2' ? newResults.scope2 : newResults.scope3,
          details: detailsObj
        };
        
        if (scope === 'scope1') {
          updatedLogs = {
            ...prevLogs,
            scope1Calculations: [
              ...prevLogs.scope1Calculations,
              calculationRecord
            ]
          };
        } else if (scope === 'scope2') {
          updatedLogs = {
            ...prevLogs,
            scope2Calculations: [
              ...prevLogs.scope2Calculations,
              calculationRecord
            ]
          };
        } else { // scope3
          updatedLogs = {
            ...prevLogs,
            scope3Calculations: [
              ...prevLogs.scope3Calculations,
              calculationRecord
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
    calculateEmissions: handleCalculateEmissions,
    handleRemoveCalculation,
    resetCalculation: resetCalculationHook,
    handleSubmitCalculation,
    isSaving,
    lastSaved
  };
};
