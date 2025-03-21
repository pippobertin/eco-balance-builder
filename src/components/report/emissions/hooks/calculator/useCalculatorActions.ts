
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
    
  const { saveCalculation, updateCalculation: updateEmissionCalculation, handleRemoveCalculation, isSaving: isSavingRecord } = 
    useEmissionRecordManager(reportId, calculationLogs, setCalculationLogs, calculatedEmissions, setCalculatedEmissions);
    
  const { resetCalculation } = 
    useEmissionReset(setCalculatedEmissions, setCalculationLogs);
    
  const { handleSubmitCalculation, isSaving: isSubmitting } = 
    useEmissionSubmit(reportId, setCalculationLogs, setCalculatedEmissions);
  
  // Access to emission records
  const { loadEmissionRecords, calculateTotals } = useEmissionRecords();
  
  // Calculate emissions wrapper that combines calculation and saving
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Starting ${scope} calculation via useCalculatorActions`);
    const calculationResult = await performEmissionCalculation(scope);
    if (calculationResult) {
      console.log(`${scope} calculation successful, saving result:`, calculationResult);
      await saveCalculation(calculationResult);
    } else {
      console.error(`${scope} calculation failed, no result to save`);
    }
    return calculationResult;
  };
  
  // Update existing emission calculation
  const updateCalculation = async (calculationId: string, scope: 'scope1' | 'scope2' | 'scope3') => {
    console.log(`Updating ${scope} calculation with ID ${calculationId}`);
    const calculationResult = await performEmissionCalculation(scope);
    
    if (calculationResult) {
      console.log(`${scope} calculation successful, updating record:`, calculationResult);
      await updateEmissionCalculation(calculationId, calculationResult);
    } else {
      console.error(`${scope} calculation update failed, no result to save`);
    }
    
    return calculationResult;
  };
  
  // Load emission records on component mount
  useEffect(() => {
    if (reportId) {
      console.log(`Loading emission records for report: ${reportId}`);
      loadEmissionRecords(reportId).then(records => {
        if (records && records.length > 0) {
          console.log(`Loaded ${records.length} emission records`);
          const newLogs: EmissionCalculationLogs = {
            scope1Calculations: records.filter(record => record.scope === 'scope1'),
            scope2Calculations: records.filter(record => record.scope === 'scope2'),
            scope3Calculations: records.filter(record => record.scope === 'scope3')
          };
          
          console.log(`Processed records: scope1=${newLogs.scope1Calculations.length}, scope2=${newLogs.scope2Calculations.length}, scope3=${newLogs.scope3Calculations.length}`);
          
          setCalculationLogs(newLogs);
          
          const totals = calculateTotals(records);
          console.log(`Calculated emission totals:`, totals);
          setCalculatedEmissions(totals);
        } else {
          console.log(`No emission records found for report: ${reportId}`);
        }
      }).catch(error => {
        console.error(`Error loading emission records:`, error);
      });
    }
  }, [reportId]);
  
  return {
    calculateEmissions,
    updateCalculation,
    handleRemoveCalculation,
    resetCalculation,
    handleSubmitCalculation,
    isSaving: isSavingRecord || isSubmitting
  };
};
