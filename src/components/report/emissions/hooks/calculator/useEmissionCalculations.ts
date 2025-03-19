
import { useState } from 'react';
import { EmissionsInput, EmissionCalculationRecord, EmissionCalculationLogs } from '@/hooks/emissions-calculator';

export const useEmissionCalculations = (
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: React.Dispatch<React.SetStateAction<EmissionCalculationLogs>>,
  calculatedEmissions: { scope1: number; scope2: number; scope3: number; total: number },
  setCalculatedEmissions: React.Dispatch<React.SetStateAction<{ scope1: number; scope2: number; scope3: number; total: number }>>
) => {
  // Update emission totals based on logs
  const updateEmissionTotals = (logs = calculationLogs) => {
    const scope1Total = logs.scope1Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope2Total = logs.scope2Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const scope3Total = logs.scope3Calculations.reduce(
      (sum, calc) => sum + Number(calc.emissions), 0
    );
    
    const total = scope1Total + scope2Total + scope3Total;
    
    console.log('Updating emission totals:', { scope1Total, scope2Total, scope3Total, total });
    
    setCalculatedEmissions({
      scope1: scope1Total,
      scope2: scope2Total,
      scope3: scope3Total,
      total
    });
  };
  
  // Helper function to generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  return {
    updateEmissionTotals,
    generateId
  };
};
