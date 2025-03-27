
import { toast } from '@/components/ui/use-toast';
import { LocationEnvironmentalMetrics } from '@/context/types';

export const useLocationMetricsHandlers = (
  selectedLocationId: string,
  formValues: any,
  setFormValues: React.Dispatch<React.SetStateAction<any>>
) => {
  // Get current location metrics
  const getCurrentLocationMetrics = () => {
    if (!selectedLocationId || !formValues.environmentalMetrics?.locationMetrics) {
      return {};
    }
    
    const locationMetric = formValues.environmentalMetrics.locationMetrics.find(
      (lm: LocationEnvironmentalMetrics) => lm.location_id === selectedLocationId
    );
    
    return locationMetric?.metrics || {};
  };

  // Handle location metrics changes
  const handleLocationMetricsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'resetEmissions') {
      handleEmissionsReset(value as 'current' | 'all');
      return;
    }
    
    setFormValues((prev: any) => {
      const locationMetrics = [...(prev.environmentalMetrics?.locationMetrics || [])];
      
      const locationIndex = locationMetrics.findIndex(
        (lm: LocationEnvironmentalMetrics) => lm.location_id === selectedLocationId
      );
      
      if (locationIndex !== -1) {
        locationMetrics[locationIndex] = {
          ...locationMetrics[locationIndex],
          metrics: {
            ...locationMetrics[locationIndex].metrics,
            [name]: value
          }
        };
      }
      
      return {
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          locationMetrics
        }
      };
    });
  };

  // Handle emissions reset
  const handleEmissionsReset = (resetScope: 'current' | 'all') => {
    setFormValues((prev: any) => {
      const environmentalMetrics = { ...prev.environmentalMetrics };
      const locationMetrics = [...(environmentalMetrics.locationMetrics || [])];
      
      if (resetScope === 'current' && selectedLocationId) {
        const locationIndex = locationMetrics.findIndex(
          (lm: LocationEnvironmentalMetrics) => lm.location_id === selectedLocationId
        );
        
        if (locationIndex !== -1) {
          locationMetrics[locationIndex] = {
            ...locationMetrics[locationIndex],
            metrics: {
              ...locationMetrics[locationIndex].metrics,
              totalScope1Emissions: "0",
              totalScope2Emissions: "0",
              totalScope3Emissions: "0",
              totalScopeEmissions: "0",
              scope1CalculationDetails: "",
              scope2CalculationDetails: "",
              scope3CalculationDetails: ""
            }
          };
          
          toast({
            title: "Dati azzerati",
            description: "I calcoli delle emissioni per la sede corrente sono stati azzerati.",
            duration: 3000
          });
        }
      } else if (resetScope === 'all') {
        // Reset all locations
        locationMetrics.forEach((lm: LocationEnvironmentalMetrics, index: number) => {
          locationMetrics[index] = {
            ...lm,
            metrics: {
              ...lm.metrics,
              totalScope1Emissions: "0",
              totalScope2Emissions: "0",
              totalScope3Emissions: "0",
              totalScopeEmissions: "0",
              scope1CalculationDetails: "",
              scope2CalculationDetails: "",
              scope3CalculationDetails: "",
              energyConsumption: "",
              fossilFuelEnergy: "",
              renewableEnergy: "",
              energyEmissionsDetails: ""
            }
          };
        });
        
        toast({
          title: "Dati azzerati",
          description: "I calcoli delle emissioni per tutte le sedi sono stati azzerati.",
          duration: 3000
        });
      }
      
      // Create a new state object to ensure React detects the change
      const updatedState = {
        ...prev,
        environmentalMetrics: {
          ...environmentalMetrics,
          locationMetrics
        }
      };
      
      return updatedState;
    });
  };

  return {
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  };
};
