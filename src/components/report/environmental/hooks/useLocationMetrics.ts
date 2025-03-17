import { useState, useEffect } from 'react';
import { LocationEnvironmentalMetrics } from '@/context/types';
import { supabase } from '@/integrations/supabase/client';
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';
import { toast } from '@/components/ui/use-toast';

export const useLocationMetrics = (
  companyId: string | undefined, 
  formValues: any, 
  setFormValues: React.Dispatch<React.SetStateAction<any>>
) => {
  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [hasMultipleLocations, setHasMultipleLocations] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('has_multiple_locations, address_street_type, address_street, address_number, address_postal_code, address_city, address_province')
          .eq('id', companyId)
          .single();
          
        if (companyError) throw companyError;
        
        setHasMultipleLocations(companyData?.has_multiple_locations || false);
        
        if (companyData?.has_multiple_locations) {
          const mainLocation: CompanyLocation = {
            id: 'main-location',
            location_type: 'sede_legale',
            address_street_type: companyData.address_street_type,
            address_street: companyData.address_street,
            address_number: companyData.address_number,
            address_postal_code: companyData.address_postal_code,
            address_city: companyData.address_city,
            address_province: companyData.address_province
          };
          
          const { data, error } = await supabase
            .from('company_locations')
            .select('*')
            .eq('company_id', companyId)
            .order('created_at');
            
          if (error) throw error;
          
          const allLocations = [mainLocation, ...(data || [])];
          setLocations(allLocations);
          
          initializeLocationMetrics(allLocations);
          
          if (!selectedLocationId && allLocations.length > 0) {
            setSelectedLocationId(allLocations[0].id || 'main-location');
          }
        }
      } catch (error) {
        console.error('Error loading company locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, [companyId]);

  const initializeLocationMetrics = (locationData: CompanyLocation[]) => {
    const existingLocationMetrics = formValues.environmentalMetrics?.locationMetrics || [];
    
    const existingLocationIds = existingLocationMetrics.map((lm: LocationEnvironmentalMetrics) => lm.location_id);
    const newLocations = locationData.filter(loc => !existingLocationIds.includes(loc.id!));
    
    if (newLocations.length > 0) {
      const newLocationMetrics = newLocations.map(loc => ({
        location_id: loc.id!,
        location_name: formatLocationName(loc),
        location_type: loc.location_type,
        metrics: {}
      }));
      
      const updatedLocationMetrics = [...existingLocationMetrics, ...newLocationMetrics];
      
      setFormValues((prev: any) => ({
        ...prev,
        environmentalMetrics: {
          ...prev.environmentalMetrics,
          locationMetrics: updatedLocationMetrics
        }
      }));
    }
  };

  const formatLocationName = (location: CompanyLocation): string => {
    const locationType = location.location_type ? 
      (location.location_type === 'sede_legale' ? 'Sede Legale' :
       location.location_type === 'sede_operativa' ? 'Sede Operativa' :
       location.location_type === 'stabilimento' ? 'Stabilimento' :
       location.location_type === 'magazzino' ? 'Magazzino' :
       location.location_type === 'ufficio' ? 'Ufficio' : 'Altro') : 'Sede';
    
    const address = [
      location.address_street_type, 
      location.address_street, 
      location.address_number
    ].filter(Boolean).join(' ');
    
    const cityInfo = [
      location.address_postal_code,
      location.address_city,
      location.address_province ? `(${location.address_province})` : ''
    ].filter(Boolean).join(' ');
    
    return `${locationType}${address ? ': ' + address : ''}${cityInfo ? ', ' + cityInfo : ''}`;
  };

  const getCurrentLocationMetrics = () => {
    if (!selectedLocationId || !formValues.environmentalMetrics?.locationMetrics) {
      return {};
    }
    
    const locationMetric = formValues.environmentalMetrics.locationMetrics.find(
      (lm: LocationEnvironmentalMetrics) => lm.location_id === selectedLocationId
    );
    
    return locationMetric?.metrics || {};
  };

  const handleLocationMetricsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'resetEmissions') {
      const resetScope = value as 'current' | 'all';
      
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
        
        const updatedState = {
          ...prev,
          environmentalMetrics: {
            ...environmentalMetrics,
            locationMetrics
          }
        };
        
        return updatedState;
      });
      
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

  return {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId,
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  };
};
