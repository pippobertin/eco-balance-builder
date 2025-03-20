
import { useState, useEffect } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';
import { useEmissionsCalculator } from '@/hooks/emissions-calculator/useEmissionsCalculator';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  updateInput: (key: string, value: any) => void,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { calculateEmissions: performCalculation } = useEmissionsCalculator();
  const { saveEmissionRecord, deleteEmissionRecord, loadEmissionRecords, calculateTotals } = useEmissionRecords(reportId);
  
  // Function to calculate emissions for a specific scope
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    try {
      console.log('Calculating emissions for scope:', scope);
      console.log('Inputs:', inputs);
      
      // Perform the calculation
      const result = performCalculation(inputs, scope);
      console.log('Calculation result:', result);
      
      // Extract the results for the specified scope
      let emissionValue = 0;
      let detailsObj: any = {};
      
      if (scope === 'scope1') {
        emissionValue = result.results.scope1;
        try {
          detailsObj = typeof result.details.scope1Details === 'string'
            ? JSON.parse(result.details.scope1Details)
            : result.details.scope1Details || {};
        } catch (e) {
          console.error('Error parsing scope1 details:', e);
          detailsObj = { rawDetails: result.details.scope1Details };
        }
      } else if (scope === 'scope2') {
        emissionValue = result.results.scope2;
        try {
          detailsObj = typeof result.details.scope2Details === 'string'
            ? JSON.parse(result.details.scope2Details)
            : result.details.scope2Details || {};
        } catch (e) {
          console.error('Error parsing scope2 details:', e);
          detailsObj = { rawDetails: result.details.scope2Details };
        }
      } else if (scope === 'scope3') {
        emissionValue = result.results.scope3;
        try {
          detailsObj = typeof result.details.scope3Details === 'string'
            ? JSON.parse(result.details.scope3Details)
            : result.details.scope3Details || {};
        } catch (e) {
          console.error('Error parsing scope3 details:', e);
          detailsObj = { rawDetails: result.details.scope3Details };
        }
      }
      
      // Only create a record if there are emissions
      if (emissionValue > 0) {
        // Create the description based on the scope and details
        const description = scope === 'scope1' 
          ? `${detailsObj.fuelType || 'Fuel'} emission` 
          : scope === 'scope2' 
          ? `${detailsObj.energyType || 'Energy'} emission`
          : `${detailsObj.wasteType || detailsObj.purchaseType || detailsObj.transportType || detailsObj.activityType || 'Scope 3'} emission`;
          
        // Create a record for saving to database
        const record = {
          report_id: reportId || '',
          scope,
          source: detailsObj.source || '',
          description,
          quantity: detailsObj.quantity || 0,
          unit: detailsObj.unit || '',
          emissions: emissionValue,
          details: detailsObj
        };
        
        // Save the record to the database
        console.log('Saving emission record:', record);
        const savedRecord = await saveEmissionRecord(record);
        
        if (savedRecord) {
          console.log('Saved record:', savedRecord);
          
          // Update calculation logs
          const updatedLogs = { ...calculationLogs };
          
          if (scope === 'scope1') {
            updatedLogs.scope1Calculations = [...(updatedLogs.scope1Calculations || []), savedRecord];
          } else if (scope === 'scope2') {
            updatedLogs.scope2Calculations = [...(updatedLogs.scope2Calculations || []), savedRecord];
          } else if (scope === 'scope3') {
            updatedLogs.scope3Calculations = [...(updatedLogs.scope3Calculations || []), savedRecord];
          }
          
          setCalculationLogs(updatedLogs);
          
          // Update emission totals
          const records = [
            ...(updatedLogs.scope1Calculations || []),
            ...(updatedLogs.scope2Calculations || []),
            ...(updatedLogs.scope3Calculations || [])
          ];
          
          const totals = calculateTotals(records);
          setCalculatedEmissions(totals);
          
          // Show success message
          toast({
            title: "Calcolo completato",
            description: `Emissioni ${scope} calcolate con successo`,
          });
        }
      } else {
        console.warn(`No emissions calculated for ${scope}`, emissionValue);
        toast({
          title: "Nessuna emissione",
          description: `Nessuna emissione calcolata per ${scope}`,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error: any) {
      console.error('Error calculating emissions:', error);
      toast({
        title: "Errore",
        description: `Impossibile calcolare le emissioni: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // Function to remove a calculation
  const handleRemoveCalculation = async (calculationId: string) => {
    try {
      console.log('Removing calculation:', calculationId);
      
      // Find which scope contains this calculation
      let scopeKey: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
      let calcIndex = -1;
      
      // Check scope1
      calcIndex = calculationLogs.scope1Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
      if (calcIndex >= 0) {
        scopeKey = 'scope1Calculations';
      }
      
      // Check scope2
      if (scopeKey === null) {
        calcIndex = calculationLogs.scope2Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
        if (calcIndex >= 0) {
          scopeKey = 'scope2Calculations';
        }
      }
      
      // Check scope3
      if (scopeKey === null) {
        calcIndex = calculationLogs.scope3Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
        if (calcIndex >= 0) {
          scopeKey = 'scope3Calculations';
        }
      }
      
      if (scopeKey && calcIndex >= 0) {
        // Delete the record from the database
        const success = await deleteEmissionRecord(calculationId);
        
        if (success) {
          // Update the local state
          const updatedLogs = { ...calculationLogs };
          updatedLogs[scopeKey] = updatedLogs[scopeKey].filter(calc => calc.id !== calculationId);
          
          // Update the calculation logs
          setCalculationLogs(updatedLogs);
          
          // Recalculate totals
          const records = [
            ...(updatedLogs.scope1Calculations || []),
            ...(updatedLogs.scope2Calculations || []),
            ...(updatedLogs.scope3Calculations || [])
          ];
          
          const totals = calculateTotals(records);
          setCalculatedEmissions(totals);
          
          toast({
            title: "Calcolo rimosso",
            description: "Il calcolo è stato rimosso con successo",
          });
        }
      } else {
        console.error('Calculation not found:', calculationId);
        toast({
          title: "Errore",
          description: "Impossibile trovare il calcolo da rimuovere",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error removing calculation:', error);
      toast({
        title: "Errore",
        description: `Impossibile rimuovere il calcolo: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // Function to reset all calculations
  const resetCalculation = async () => {
    try {
      setCalculatedEmissions({
        scope1: 0,
        scope2: 0,
        scope3: 0,
        total: 0
      });
      
      setCalculationLogs({
        scope1Calculations: [],
        scope2Calculations: [],
        scope3Calculations: []
      });
      
      toast({
        title: "Calcoli azzerati",
        description: "Tutti i calcoli sono stati azzerati",
      });
    } catch (error: any) {
      console.error('Error resetting calculations:', error);
      toast({
        title: "Errore",
        description: `Impossibile azzerare i calcoli: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // Function to submit all calculations
  const handleSubmitCalculation = async () => {
    if (!reportId) {
      console.error('Cannot submit calculation: reportId is undefined');
      toast({
        title: "Errore",
        description: "ID Report non valido, impossibile salvare",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Submitting all calculations');
      
      // Reload all records to ensure we have the latest data
      const records = await loadEmissionRecords(reportId);
      console.log('Loaded records:', records);
      
      // Calculate new totals
      const totals = calculateTotals(records);
      console.log('Calculated totals:', totals);
      
      // Update the state with the latest data
      const newLogs: EmissionCalculationLogs = {
        scope1Calculations: records.filter((record: EmissionCalculationRecord) => record.scope === 'scope1'),
        scope2Calculations: records.filter((record: EmissionCalculationRecord) => record.scope === 'scope2'),
        scope3Calculations: records.filter((record: EmissionCalculationRecord) => record.scope === 'scope3')
      };
      
      setCalculationLogs(newLogs);
      setCalculatedEmissions(totals);
      
      toast({
        title: "Emissioni salvate",
        description: "Tutti i calcoli sono stati salvati con successo",
      });
      
      return totals;
    } catch (error: any) {
      console.error('Error submitting calculations:', error);
      toast({
        title: "Errore",
        description: `Impossibile salvare i calcoli: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Load existing records when component mounts or reportId changes
  useEffect(() => {
    if (reportId) {
      loadEmissionRecords(reportId).then(records => {
        if (records && records.length > 0) {
          // Organize records by scope
          const newLogs: EmissionCalculationLogs = {
            scope1Calculations: records.filter(record => record.scope === 'scope1'),
            scope2Calculations: records.filter(record => record.scope === 'scope2'),
            scope3Calculations: records.filter(record => record.scope === 'scope3')
          };
          
          setCalculationLogs(newLogs);
          
          // Calculate totals
          const totals = calculateTotals(records);
          setCalculatedEmissions(totals);
        }
      });
    }
  }, [reportId]);
  
  return {
    calculateEmissions,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving
  };
};
