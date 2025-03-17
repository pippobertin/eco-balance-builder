
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';
import { LocationEnvironmentalMetrics } from '@/context/types';

export const useLocationData = (
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
          
          initializeLocationMetrics(allLocations, formValues, setFormValues);
          
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

  // Helper function to initialize location metrics
  const initializeLocationMetrics = (
    locationData: CompanyLocation[], 
    formValues: any,
    setFormValues: React.Dispatch<React.SetStateAction<any>>
  ) => {
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

  return {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId
  };
};

// Utility function to format location name for display
export const formatLocationName = (location: CompanyLocation): string => {
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
