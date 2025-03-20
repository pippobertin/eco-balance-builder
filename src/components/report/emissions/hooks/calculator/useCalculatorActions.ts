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
  const { saveEmissionRecord, deleteEmissionRecord, loadEmissionRecords, calculateTotals } = useEmissionRecords();
  
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    try {
      console.log('Calculating emissions for scope:', scope);
      console.log('Inputs:', inputs);
      
      const result = performCalculation(inputs, scope);
      console.log('Calculation result:', result);
      
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
      
      if (emissionValue > 0) {
        const description = scope === 'scope1' 
          ? `${detailsObj.fuelType || 'Fuel'} emission` 
          : scope === 'scope2' 
          ? `${detailsObj.energyType || 'Energy'} emission`
          : `${detailsObj.wasteType || detailsObj.purchaseType || detailsObj.transportType || detailsObj.activityType || 'Scope 3'} emission`;
          
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
        
        console.log('Saving emission record:', record);
        const savedRecord = await saveEmissionRecord(record);
        
        if (savedRecord) {
          console.log('Saved record:', savedRecord);
          
          const updatedLogs = { ...calculationLogs };
          
          if (scope === 'scope1') {
            updatedLogs.scope1Calculations = [...(updatedLogs.scope1Calculations || []), savedRecord];
          } else if (scope === 'scope2') {
            updatedLogs.scope2Calculations = [...(updatedLogs.scope2Calculations || []), savedRecord];
          } else if (scope === 'scope3') {
            updatedLogs.scope3Calculations = [...(updatedLogs.scope3Calculations || []), savedRecord];
          }
          
          setCalculationLogs(updatedLogs);
          
          const records = [
            ...(updatedLogs.scope1Calculations || []),
            ...(updatedLogs.scope2Calculations || []),
            ...(updatedLogs.scope3Calculations || [])
          ];
          
          const totals = calculateTotals(records);
          setCalculatedEmissions(totals);
          
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
  
  const handleRemoveCalculation = async (calculationId: string) => {
    try {
      console.log('Removing calculation:', calculationId);
      
      let scopeKey: 'scope1Calculations' | 'scope2Calculations' | 'scope3Calculations' | null = null;
      let calcIndex = -1;
      
      calcIndex = calculationLogs.scope1Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
      if (calcIndex >= 0) {
        scopeKey = 'scope1Calculations';
      }
      
      if (scopeKey === null) {
        calcIndex = calculationLogs.scope2Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
        if (calcIndex >= 0) {
          scopeKey = 'scope2Calculations';
        }
      }
      
      if (scopeKey === null) {
        calcIndex = calculationLogs.scope3Calculations?.findIndex(calc => calc.id === calculationId) ?? -1;
        if (calcIndex >= 0) {
          scopeKey = 'scope3Calculations';
        }
      }
      
      if (scopeKey && calcIndex >= 0) {
        const success = await deleteEmissionRecord(calculationId);
        
        if (success) {
          const updatedLogs = { ...calculationLogs };
          updatedLogs[scopeKey] = updatedLogs[scopeKey].filter(calc => calc.id !== calculationId);
          
          setCalculationLogs(updatedLogs);
          
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
      
      const records = await loadEmissionRecords(reportId);
      console.log('Loaded records:', records);
      
      const totals = calculateTotals(records);
      console.log('Calculated totals:', totals);
      
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
  
  useEffect(() => {
    if (reportId) {
      loadEmissionRecords(reportId).then(records => {
        if (records && records.length > 0) {
          const newLogs: EmissionCalculationLogs = {
            scope1Calculations: records.filter(record => record.scope === 'scope1'),
            scope2Calculations: records.filter(record => record.scope === 'scope2'),
            scope3Calculations: records.filter(record => record.scope === 'scope3')
          };
          
          setCalculationLogs(newLogs);
          
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
