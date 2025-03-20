
import { useEffect } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useEmissionCalculation } from './actions/useEmissionCalculation';
import { useEmissionRecordManager } from './actions/useEmissionRecordManager';
import { useEmissionReset } from './actions/useEmissionReset';
import { useEmissionSubmit } from './actions/useEmissionSubmit';

export const useCalculatorActions = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  updateInput: (key: string, value: any) => void,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  // Initialize specialized hooks
  const { calculateEmissions: performEmissionCalculation } = 
    useEmissionCalculation(reportId, inputs, calculationLogs, setCalculationLogs, calculatedEmissions, setCalculatedEmissions);
    
  const { saveCalculation, handleRemoveCalculation, isSaving: isSavingRecord } = 
    useEmissionRecordManager(reportId, calculationLogs, setCalculationLogs, calculatedEmissions, setCalculatedEmissions);
    
  const { resetCalculation } = 
    useEmissionReset(setCalculatedEmissions, setCalculationLogs);
    
  const { handleSubmitCalculation, isSaving: isSubmitting } = 
    useEmissionSubmit(reportId, setCalculationLogs, setCalculatedEmissions);
    
  const { loadEmissionRecords } = useEmissionRecords();
  
  // Calculate emissions wrapper that combines calculation and saving
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    const calculationResult = await performEmissionCalculation(scope);
    if (calculationResult) {
      await saveCalculation(calculationResult);
    }
    return calculationResult;
  };
  
  // Load emission records on component mount
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
          
          const totals = useEmissionRecords().calculateTotals(records);
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
    isSaving: isSavingRecord || isSubmitting
  };
};
