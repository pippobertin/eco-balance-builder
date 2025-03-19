
import { useState, useEffect } from 'react';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';
import { useEmissionsLoad } from './emissions-results/useEmissionsLoad';

export const useExistingEmissions = (reportId: string | undefined) => {
  const [existingEmissions, setExistingEmissions] = useState<{
    scope1: number;
    scope2: number;
    scope3: number;
    total: number;
  } | null>(null);
  
  const [existingCalculations, setExistingCalculations] = useState<EmissionCalculationLogs | null>(null);
  const { loadEmissionsData, isLoading, error } = useEmissionsLoad(reportId);
  
  useEffect(() => {
    const loadExistingData = async () => {
      if (!reportId) return;
      
      try {
        const emissionsData = await loadEmissionsData(reportId);
        
        if (emissionsData) {
          // Calculate totals from the calculation logs
          let calculationLogs: EmissionCalculationLogs = {
            scope1Calculations: [],
            scope2Calculations: [],
            scope3Calculations: []
          };
          
          // Parse calculation logs if available
          if (emissionsData.calculation_logs) {
            try {
              // Handle both string and object formats
              if (typeof emissionsData.calculation_logs === 'string') {
                calculationLogs = JSON.parse(emissionsData.calculation_logs);
              } else if (typeof emissionsData.calculation_logs === 'object') {
                calculationLogs = emissionsData.calculation_logs;
              }
              
              // Ensure all calculation arrays exist
              calculationLogs.scope1Calculations = Array.isArray(calculationLogs.scope1Calculations) 
                ? calculationLogs.scope1Calculations : [];
              calculationLogs.scope2Calculations = Array.isArray(calculationLogs.scope2Calculations) 
                ? calculationLogs.scope2Calculations : [];
              calculationLogs.scope3Calculations = Array.isArray(calculationLogs.scope3Calculations) 
                ? calculationLogs.scope3Calculations : [];
              
              // Calculate totals from the calculations
              const scope1 = calculationLogs.scope1Calculations.reduce(
                (sum, calc) => sum + Number(calc.emissions || 0), 0);
              const scope2 = calculationLogs.scope2Calculations.reduce(
                (sum, calc) => sum + Number(calc.emissions || 0), 0);
              const scope3 = calculationLogs.scope3Calculations.reduce(
                (sum, calc) => sum + Number(calc.emissions || 0), 0);
              const total = scope1 + scope2 + scope3;
              
              // Set the emissions values
              setExistingEmissions({
                scope1,
                scope2,
                scope3,
                total
              });
              
              console.log('Loaded calculation logs:', {
                scope1Count: calculationLogs.scope1Calculations.length,
                scope2Count: calculationLogs.scope2Calculations.length,
                scope3Count: calculationLogs.scope3Calculations.length
              });
            } catch (e) {
              console.error('Error parsing calculation logs:', e);
            }
          }
          
          setExistingCalculations(calculationLogs);
        }
      } catch (error) {
        console.error('Error in loadExistingData:', error);
      }
    };
    
    loadExistingData();
  }, [reportId, loadEmissionsData]);
  
  return {
    existingEmissions,
    existingCalculations,
    isLoading,
    error
  };
};
