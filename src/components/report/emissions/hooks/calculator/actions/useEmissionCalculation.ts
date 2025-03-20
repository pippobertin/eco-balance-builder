
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionsInput, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { performEmissionsCalculation } from '@/hooks/emissions-calculator/calculation/performCalculation';
import { useToast } from '@/hooks/use-toast';

export const useEmissionCalculation = (
  reportId: string | undefined,
  inputs: EmissionsInput,
  calculationLogs: EmissionCalculationLogs,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  calculatedEmissions: EmissionsResults,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  
  /**
   * Calculate emissions for the selected scope
   */
  const calculateEmissions = async (scope: 'scope1' | 'scope2' | 'scope3') => {
    if (!reportId) {
      console.error('Cannot calculate emissions: reportId is undefined');
      toast({
        title: "Errore di calcolo",
        description: "ID Report mancante, impossibile calcolare le emissioni",
        variant: "destructive"
      });
      return null;
    }
    
    console.log('Calculating emissions for scope:', scope);
    console.log('Inputs:', JSON.stringify(inputs));
    
    // Validate required inputs per scope
    if (scope === 'scope1') {
      if (!inputs.fuelType) {
        console.error('Missing fuel type for scope1 calculation');
        toast({
          title: "Dati mancanti",
          description: "Seleziona un tipo di combustibile",
          variant: "destructive"
        });
        return null;
      }
      
      if (!inputs.fuelQuantity || inputs.fuelQuantity === '') {
        console.error('Missing fuel quantity for scope1 calculation');
        toast({
          title: "Dati mancanti",
          description: "Inserisci la quantità di combustibile",
          variant: "destructive"
        });
        return null;
      }
    } else if (scope === 'scope2') {
      if (!inputs.energyType) {
        console.error('Missing energy type for scope2 calculation');
        toast({
          title: "Dati mancanti",
          description: "Seleziona un tipo di energia",
          variant: "destructive"
        });
        return null;
      }
      
      if (!inputs.energyQuantity || inputs.energyQuantity === '') {
        console.error('Missing energy quantity for scope2 calculation');
        toast({
          title: "Dati mancanti",
          description: "Inserisci la quantità di energia",
          variant: "destructive"
        });
        return null;
      }
    } else if (scope === 'scope3') {
      if (!inputs.scope3Category) {
        console.error('Missing scope3 category for scope3 calculation');
        toast({
          title: "Dati mancanti",
          description: "Seleziona una categoria di Scope 3",
          variant: "destructive"
        });
        return null;
      }
      
      if (inputs.scope3Category === 'transport') {
        if (!inputs.transportType) {
          console.error('Missing transport type for scope3 transport calculation');
          toast({
            title: "Dati mancanti",
            description: "Seleziona un tipo di trasporto",
            variant: "destructive"
          });
          return null;
        }
        
        if (!inputs.transportDistance || inputs.transportDistance === '') {
          console.error('Missing transport distance for scope3 transport calculation');
          toast({
            title: "Dati mancanti",
            description: "Inserisci la distanza di trasporto",
            variant: "destructive"
          });
          return null;
        }
      } else if (inputs.scope3Category === 'waste') {
        if (!inputs.wasteType) {
          console.error('Missing waste type for scope3 waste calculation');
          toast({
            title: "Dati mancanti",
            description: "Seleziona un tipo di rifiuto",
            variant: "destructive"
          });
          return null;
        }
        
        if (!inputs.wasteQuantity || inputs.wasteQuantity === '') {
          console.error('Missing waste quantity for scope3 waste calculation');
          toast({
            title: "Dati mancanti",
            description: "Inserisci la quantità di rifiuti",
            variant: "destructive"
          });
          return null;
        }
      } else if (inputs.scope3Category === 'purchases') {
        if (!inputs.purchaseType) {
          console.error('Missing purchase type for scope3 purchases calculation');
          toast({
            title: "Dati mancanti",
            description: "Seleziona un tipo di acquisto",
            variant: "destructive"
          });
          return null;
        }
        
        if (!inputs.purchaseQuantity || inputs.purchaseQuantity === '') {
          console.error('Missing purchase quantity for scope3 purchases calculation');
          toast({
            title: "Dati mancanti",
            description: "Inserisci la quantità acquistata",
            variant: "destructive"
          });
          return null;
        }
      }
    }
    
    setIsCalculating(true);
    
    try {
      // Perform calculation
      const { results, details } = performEmissionsCalculation(inputs, scope);
      
      console.log('Calculation results:', results);
      
      // Set new results
      setCalculatedEmissions({
        scope1: results.scope1,
        scope2: results.scope2,
        scope3: results.scope3,
        total: results.total
      });
      
      // Get the appropriate details
      let calculationDetails = '';
      let description = '';
      let emissionValue = 0;
      let detailsObj = {};
      
      if (scope === 'scope1') {
        calculationDetails = details.scope1Details;
        description = `${inputs.fuelType} emission`;
        emissionValue = results.scope1;
      } else if (scope === 'scope2') {
        calculationDetails = details.scope2Details;
        description = `${inputs.energyType} emission`;
        emissionValue = results.scope2;
      } else if (scope === 'scope3') {
        calculationDetails = details.scope3Details;
        
        if (inputs.scope3Category === 'transport') {
          description = `${inputs.transportType} emission`;
        } else if (inputs.scope3Category === 'waste') {
          description = `${inputs.wasteType} emission`;
        } else if (inputs.scope3Category === 'purchases') {
          description = inputs.purchaseDescription || `${inputs.purchaseType} emission`;
        }
        
        emissionValue = results.scope3;
      }
      
      // Return if no calculation was performed
      if (!calculationDetails) {
        console.error('No calculation details available for scope:', scope);
        return null;
      }
      
      // Parse details if available
      try {
        detailsObj = JSON.parse(calculationDetails);
        console.log('Processed details:', detailsObj);
      } catch (e) {
        console.error('Error parsing calculation details:', e);
        return null;
      }
      
      toast({
        title: "Calcolo completato",
        description: `Emissioni ${scope} calcolate con successo`,
      });
      
      return {
        emissionValue,
        detailsObj,
        description,
        scope,
        reportId
      };
    } catch (error: any) {
      console.error('Error calculating emissions:', error);
      toast({
        title: "Errore di calcolo",
        description: `Impossibile calcolare le emissioni: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCalculating(false);
    }
  };
  
  return {
    calculateEmissions,
    isCalculating
  };
};
