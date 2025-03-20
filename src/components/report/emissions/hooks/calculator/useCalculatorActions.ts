
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator/useEmissionsCalculator';
import { useEmissionsSave } from '../emissions-results/useEmissionsSave';
import { useToast } from '@/hooks/use-toast';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  updateInput: (key: string, value: any) => void,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (results: EmissionsResults) => void
) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const { saveEmissions } = useEmissionsSave();
  
  // Initialize the emissions calculator
  const { 
    calculateEmissions: calculateEmissionsWithHook,
    results,
    removeCalculation: removeCalculationWithHook,
    resetCalculation: resetCalculationWithHook
  } = useEmissionsCalculator(
    inputs,
    (results, details) => {
      console.log('Calculator results updated:', results);
      setCalculatedEmissions(results);
    },
    (logs) => {
      console.log('Calculator logs updated:', logs);
      console.log('Log structure:', {
        scope1: logs.scope1Calculations?.length || 0,
        scope2: logs.scope2Calculations?.length || 0,
        scope3: logs.scope3Calculations?.length || 0
      });
      setCalculationLogs(logs);
    }
  );
  
  // Call the emissions calculation hook
  const calculateEmissions = (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Calculating emissions for ${scope} with inputs:`, inputs);
    console.log('Current calculation logs before calculation:', calculationLogs);
    console.log('Logs structure:', {
      scope1: calculationLogs.scope1Calculations?.length || 0,
      scope2: calculationLogs.scope2Calculations?.length || 0,
      scope3: calculationLogs.scope3Calculations?.length || 0
    });
    
    try {
      // Perform the calculation
      const result = calculateEmissionsWithHook(scope);
      console.log(`Calculation result for ${scope}:`, result);
      
      // Show toast notification
      toast({
        title: "Calcolo completato",
        description: `Il calcolo delle emissioni per ${scope === 'scope1' ? 'Scope 1' : scope === 'scope2' ? 'Scope 2' : 'Scope 3'} è stato completato`
      });
      
      return result;
    } catch (error) {
      console.error('Error calculating emissions:', error);
      
      toast({
        title: "Errore",
        description: `Si è verificato un errore durante il calcolo delle emissioni: ${error}`,
        variant: "destructive"
      });
      
      return null;
    }
  };
  
  // Handle saving the calculation data
  const handleSubmitCalculation = async () => {
    if (!reportId) {
      console.error('Cannot save calculation: report ID is undefined');
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati. ID report non disponibile.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Submitting calculation with logs:', calculationLogs);
      console.log('Logs structure:', {
        scope1: calculationLogs.scope1Calculations?.length || 0,
        scope2: calculationLogs.scope2Calculations?.length || 0,
        scope3: calculationLogs.scope3Calculations?.length || 0
      });
      
      // Extract emissions values from calculated results
      const scope1 = calculatedEmissions.scope1 || 0;
      const scope2 = calculatedEmissions.scope2 || 0;
      const scope3 = calculatedEmissions.scope3 || 0;
      
      console.log('Saving emissions values:', { scope1, scope2, scope3 });
      
      // Save the emissions data
      const result = await saveEmissions(
        reportId,
        scope1,
        scope2,
        scope3,
        calculationLogs
      );
      
      console.log('Save emissions result:', result);
      
      if (result) {
        toast({
          title: "Salvato",
          description: "I dati delle emissioni sono stati salvati con successo"
        });
      }
    } catch (error) {
      console.error('Error submitting calculation:', error);
      
      toast({
        title: "Errore",
        description: `Si è verificato un errore durante il salvataggio: ${error}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle removing a calculation
  const handleRemoveCalculation = (calculationId: string) => {
    console.log('Removing calculation with ID:', calculationId);
    console.log('Current logs before removal:', calculationLogs);
    
    // Call the hook's removeCalculation function
    const { updatedLogs, updatedResults } = removeCalculationWithHook(calculationId, calculationLogs);
    
    // Update state
    setCalculationLogs(updatedLogs);
    setCalculatedEmissions(updatedResults);
    
    console.log('Updated logs after removal:', updatedLogs);
    console.log('Updated results after removal:', updatedResults);
    
    // Show toast notification
    toast({
      title: "Calcolo rimosso",
      description: "Il calcolo selezionato è stato rimosso con successo"
    });
  };
  
  // Reset the calculation
  const resetCalculation = () => {
    console.log('Resetting calculation');
    
    // Call the hook's resetCalculation function
    resetCalculationWithHook();
    
    // Reset inputs
    updateInput('scope1Source', 'fuel');
    updateInput('fuelType', 'DIESEL');
    updateInput('fuelQuantity', '');
    updateInput('fuelUnit', 'L');
    updateInput('energyType', 'ELECTRICITY_IT');
    updateInput('energyQuantity', '');
    updateInput('renewablePercentage', 0);
    updateInput('energyProvider', '');
    updateInput('scope3Category', 'transport');
    updateInput('transportType', 'BUSINESS_TRAVEL_CAR');
    updateInput('transportDistance', '');
    updateInput('wasteType', 'WASTE_LANDFILL');
    updateInput('wasteQuantity', '');
    updateInput('purchaseType', 'PURCHASED_GOODS');
    updateInput('purchaseQuantity', '');
    updateInput('purchaseDescription', '');
    updateInput('periodType', 'ANNUAL');
    
    // Show toast notification
    toast({
      title: "Reset completato",
      description: "Tutti i dati di calcolo sono stati reimpostati"
    });
  };
  
  return {
    calculateEmissions,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving
  };
};
