import { useState } from 'react';
import { EmissionCalculationLogs, EmissionCalculationRecord } from '@/hooks/emissions-calculator/types';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';

export const useEmissionRecordManager = (
  reportId: string | undefined,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: any,
  setCalculatedEmissions: (emissions: any) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { currentReport } = useReport();
  const { saveEmissionRecord, updateEmissionRecord, deleteEmissionRecord, loadEmissionRecords, calculateTotals } = useEmissionRecords();
  
  // Save emission calculation after successful calculation
  const saveCalculation = async (calculationData: { 
    emissionValue: number;
    detailsObj: any;
    description: string;
    scope: 'scope1' | 'scope2' | 'scope3';
    reportId: string | undefined;
  }) => {
    // Use current report ID from context as fallback if the passed reportId is undefined
    const effectiveReportId = calculationData.reportId || reportId || currentReport?.id;
    
    if (!effectiveReportId) {
      console.error('Cannot save emission record: reportId is undefined. Make sure you are in a valid report context.');
      toast({
        title: "Errore di salvataggio",
        description: "Impossibile salvare il calcolo: ID Report mancante",
        variant: "destructive"
      });
      return null;
    }
    
    const { emissionValue, detailsObj, description, scope } = calculationData;
    
    // Create record object with appropriate values based on scope
    let sourceValue = '';
    let quantityValue = 0;
    let unitValue = '';
    
    if (scope === 'scope1' && detailsObj.fuelType) {
      sourceValue = detailsObj.fuelType;
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || 'L';
    } else if (scope === 'scope2' && detailsObj.energyType) {
      sourceValue = detailsObj.energyType;
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || 'kWh';
    } else if (scope === 'scope3') {
      sourceValue = detailsObj.activityType || '';
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || '';
    } else {
      sourceValue = detailsObj.source || '';
    }
    
    const record = {
      report_id: effectiveReportId,
      scope,
      source: sourceValue,
      description,
      quantity: quantityValue,
      unit: unitValue,
      emissions: emissionValue,
      details: detailsObj,
      date: new Date().toISOString() // Adding the missing date property
    };
    
    console.log('Saving emission record:', record);
    setIsSaving(true);
    
    try {
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
    } catch (error) {
      console.error('Error saving emission record:', error);
      toast({
        title: "Errore",
        description: `Impossibile salvare il calcolo: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
    
    return null;
  };
  
  // Update an existing emission calculation
  const updateCalculation = async (
    calculationId: string,
    calculationData: { 
      emissionValue: number;
      detailsObj: any;
      description: string;
      scope: 'scope1' | 'scope2' | 'scope3';
      reportId: string | undefined;
    }
  ) => {
    const effectiveReportId = calculationData.reportId || reportId || currentReport?.id;
    
    if (!effectiveReportId) {
      console.error('Cannot update emission record: reportId is undefined.');
      toast({
        title: "Errore di aggiornamento",
        description: "Impossibile aggiornare il calcolo: ID Report mancante",
        variant: "destructive"
      });
      return null;
    }
    
    const { emissionValue, detailsObj, description, scope } = calculationData;
    
    // Create record object with appropriate values based on scope
    let sourceValue = '';
    let quantityValue = 0;
    let unitValue = '';
    
    if (scope === 'scope1' && detailsObj.fuelType) {
      sourceValue = detailsObj.fuelType;
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || 'L';
    } else if (scope === 'scope2' && detailsObj.energyType) {
      sourceValue = detailsObj.energyType;
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || 'kWh';
    } else if (scope === 'scope3') {
      sourceValue = detailsObj.activityType || '';
      quantityValue = detailsObj.quantity || 0;
      unitValue = detailsObj.unit || '';
    } else {
      sourceValue = detailsObj.source || '';
    }
    
    const recordUpdate = {
      id: calculationId,
      report_id: effectiveReportId,
      scope,
      source: sourceValue,
      description,
      quantity: quantityValue,
      unit: unitValue,
      emissions: emissionValue,
      details: detailsObj,
      date: new Date().toISOString() // Adding the missing date property
    };
    
    console.log('Updating emission record:', recordUpdate);
    setIsSaving(true);
    
    try {
      const updatedRecord = await updateEmissionRecord(recordUpdate);
      
      if (updatedRecord) {
        console.log('Updated record:', updatedRecord);
        
        // Find and update the record in the calculation logs
        const updatedLogs = { ...calculationLogs };
        
        if (scope === 'scope1') {
          updatedLogs.scope1Calculations = updatedLogs.scope1Calculations.map(calc => 
            calc.id === calculationId ? updatedRecord : calc
          );
        } else if (scope === 'scope2') {
          updatedLogs.scope2Calculations = updatedLogs.scope2Calculations.map(calc => 
            calc.id === calculationId ? updatedRecord : calc
          );
        } else if (scope === 'scope3') {
          updatedLogs.scope3Calculations = updatedLogs.scope3Calculations.map(calc => 
            calc.id === calculationId ? updatedRecord : calc
          );
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
          title: "Calcolo aggiornato",
          description: `Emissioni ${scope} aggiornate con successo`,
        });
        
        return updatedRecord;
      }
    } catch (error) {
      console.error('Error updating emission record:', error);
      toast({
        title: "Errore",
        description: `Impossibile aggiornare il calcolo: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
    updateCalculation,
    handleRemoveCalculation,
    isSaving
  };
};
