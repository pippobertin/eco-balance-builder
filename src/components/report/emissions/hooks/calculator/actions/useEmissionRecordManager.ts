
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionCalculationRecord, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useToast } from '@/hooks/use-toast';

export const useEmissionRecordManager = (
  reportId: string | undefined,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { saveEmissionRecord, deleteEmissionRecord, loadEmissionRecords, calculateTotals } = useEmissionRecords();
  
  // Save emission calculation after successful calculation
  const saveCalculation = async (calculationData: { 
    emissionValue: number;
    detailsObj: any;
    description: string;
    scope: 'scope1' | 'scope2' | 'scope3';
    reportId: string | undefined;
  }) => {
    if (!calculationData || !calculationData.reportId) return null;
    
    const { emissionValue, detailsObj, description, scope, reportId } = calculationData;
    
    const record = {
      report_id: reportId,
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
      
      return savedRecord;
    }
    
    return null;
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
  
  return {
    saveCalculation,
    handleRemoveCalculation,
    isSaving
  };
};
