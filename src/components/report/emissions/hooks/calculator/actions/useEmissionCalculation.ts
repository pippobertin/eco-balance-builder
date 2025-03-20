
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionsCalculations } from '@/hooks/emissions-calculator/useEmissionsCalculations';
import { useToast } from '@/hooks/use-toast';

export const useEmissionCalculation = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  const { toast } = useToast();
  
  // Use the simplified emissions calculation hook
  const { performCalculation } = useEmissionsCalculations();
  
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    try {
      console.log('Calculating emissions for scope:', scope);
      console.log('Inputs:', inputs);
      
      // Perform calculation with inputs and scope
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
          
        return { 
          emissionValue, 
          detailsObj, 
          description, 
          scope, 
          reportId 
        };
      } else {
        console.warn(`No emissions calculated for ${scope}`, emissionValue);
        toast({
          title: "Nessuna emissione",
          description: `Nessuna emissione calcolata per ${scope}`,
          variant: "destructive"
        });
      }
      
      return null;
    } catch (error: any) {
      console.error('Error calculating emissions:', error);
      toast({
        title: "Errore",
        description: `Impossibile calcolare le emissioni: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };
  
  return {
    calculateEmissions
  };
};
