
import { useState, useEffect } from 'react';
import { useEmissionsLoad } from '../emissions-results/useEmissionsLoad';
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';

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
          // Set the emissions values
          setExistingEmissions({
            scope1: Number(emissionsData.scope1_emissions) || 0,
            scope2: Number(emissionsData.scope2_emissions) || 0,
            scope3: Number(emissionsData.scope3_emissions) || 0,
            total: Number(emissionsData.total_emissions) || 0
          });
          
          // Set the calculation logs
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
