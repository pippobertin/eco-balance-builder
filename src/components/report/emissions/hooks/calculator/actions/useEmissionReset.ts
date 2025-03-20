
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useToast } from '@/hooks/use-toast';

export const useEmissionReset = (
  setCalculatedEmissions: (emissions: EmissionsResults) => void,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void
) => {
  const { toast } = useToast();
  
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
  
  return {
    resetCalculation
  };
};
