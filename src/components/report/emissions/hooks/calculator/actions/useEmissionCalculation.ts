
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
      console.log('Inputs:', JSON.stringify(inputs));
      
      if (!inputs) {
        console.error('Missing inputs for calculation');
        toast({
          title: "Dati mancanti",
          description: "I dati necessari per il calcolo non sono completi.",
          variant: "destructive"
        });
        return null;
      }
      
      // Perform calculation with inputs and scope
      const result = performCalculation(inputs, scope);
      console.log('Calculation result:', JSON.stringify(result));
      
      if (!result || !result.results) {
        console.error('No valid calculation result returned');
        toast({
          title: "Errore di calcolo",
          description: "Si è verificato un errore durante il calcolo delle emissioni.",
          variant: "destructive"
        });
        return null;
      }
      
      let emissionValue = 0;
      let detailsObj: any = {};
      
      if (scope === 'scope1') {
        emissionValue = result.results.scope1 || 0;
        try {
          detailsObj = typeof result.details.scope1Details === 'string'
            ? JSON.parse(result.details.scope1Details)
            : result.details.scope1Details || {};
        } catch (e) {
          console.error('Error parsing scope1 details:', e);
          detailsObj = { rawDetails: result.details.scope1Details };
        }
      } else if (scope === 'scope2') {
        emissionValue = result.results.scope2 || 0;
        try {
          detailsObj = typeof result.details.scope2Details === 'string'
            ? JSON.parse(result.details.scope2Details)
            : result.details.scope2Details || {};
        } catch (e) {
          console.error('Error parsing scope2 details:', e);
          detailsObj = { rawDetails: result.details.scope2Details };
        }
      } else if (scope === 'scope3') {
        emissionValue = result.results.scope3 || 0;
        try {
          detailsObj = typeof result.details.scope3Details === 'string'
            ? JSON.parse(result.details.scope3Details)
            : result.details.scope3Details || {};
        } catch (e) {
          console.error('Error parsing scope3 details:', e);
          detailsObj = { rawDetails: result.details.scope3Details };
        }
      }
      
      console.log('Processed emission value:', emissionValue);
      console.log('Processed details:', JSON.stringify(detailsObj));
      
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
          description: `Nessuna emissione calcolata per ${scope}. Controlla i dati inseriti.`,
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
