
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';
import { LocationEnvironmentalMetrics } from '@/context/types';

export const formatLocationName = (location: CompanyLocation): string => {
  const parts = [];
  if (location.address_street_type) parts.push(location.address_street_type);
  if (location.address_street) parts.push(location.address_street);
  if (location.address_number) parts.push(location.address_number);
  if (location.address_city) parts.push(location.address_city);
  
  return parts.join(' ');
};

export const useLocationData = (
  companyId?: string, 
  formValues: any = {}, 
  setFormValues?: React.Dispatch<React.SetStateAction<any>>
) => {
  const [locations, setLocations] = useState<CompanyLocation[]>([]);
  const [hasMultipleLocations, setHasMultipleLocations] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load company locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (!companyId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('company_locations')
          .select('*')
          .eq('company_id', companyId);
        
        if (error) {
          console.error("Error fetching company locations:", error);
          toast.error("Errore nel caricamento delle sedi dell'azienda");
          return;
        }
        
        if (data && data.length > 0) {
          setLocations(data);
          setHasMultipleLocations(data.length > 1);
          
          // If no location is selected, select the first one
          if (!selectedLocationId) {
            setSelectedLocationId(data[0].id);
          }
        } else {
          // If no locations are found, create a default location
          const defaultLocation: CompanyLocation = {
            id: 'default-location',
            company_id: companyId,
            location_type: 'headquarters',
            address_street_type: '',
            address_street: '',
            address_number: '',
            address_postal_code: '',
            address_city: '',
            address_province: '',
            created_at: new Date().toISOString()
          };
          
          setLocations([defaultLocation]);
          setHasMultipleLocations(false);
          setSelectedLocationId('default-location');
        }
      } catch (error) {
        console.error("Unexpected error fetching company locations:", error);
        toast.error("Errore nel caricamento delle sedi dell'azienda");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLocations();
  }, [companyId, selectedLocationId]);
  
  // Load location metrics based on report_id and location_id
  useEffect(() => {
    const fetchLocationMetrics = async () => {
      if (!formValues?.reportId || !selectedLocationId) return;
      
      try {
        // Check if metrics for this location already exist in form values
        const existingLocationMetrics = formValues.environmentalMetrics?.locationMetrics || [];
        const locationMetric = existingLocationMetrics.find(
          (metric: LocationEnvironmentalMetrics) => metric.locationId === selectedLocationId
        );
        
        if (locationMetric) {
          // Location metrics already loaded, no need to fetch from the database
          return;
        }
        
        const { data, error } = await supabase
          .from('location_metrics')
          .select('*')
          .eq('report_id', formValues.reportId)
          .eq('location_id', selectedLocationId);
          
        if (error) {
          console.error("Error fetching location metrics:", error);
          return;
        }
        
        if (data && data.length > 0) {
          // Add location metrics to form values
          const newLocationMetrics = [...existingLocationMetrics];
          const locationMetrics = data.map((item: any) => ({
            id: item.id,
            locationId: item.location_id,
            name: item.location_name,
            locationType: item.location_type,
            metrics: item.metrics || {}
          }));
          
          const updatedLocationMetrics = [...newLocationMetrics, ...locationMetrics];
          
          if (setFormValues) {
            setFormValues((prev: any) => ({
              ...prev,
              environmentalMetrics: {
                ...prev.environmentalMetrics,
                locationMetrics: updatedLocationMetrics
              }
            }));
          }
        } else {
          // If no metrics found for this location, create an empty entry
          const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
          
          if (selectedLocation) {
            const newLocationMetric: LocationEnvironmentalMetrics = {
              id: `temp-${selectedLocationId}`,
              locationId: selectedLocationId,
              name: formatLocationName(selectedLocation),
              locationType: selectedLocation.location_type || 'headquarters',
              metrics: {}
            };
            
            if (setFormValues) {
              setFormValues((prev: any) => ({
                ...prev,
                environmentalMetrics: {
                  ...prev.environmentalMetrics,
                  locationMetrics: [...(prev.environmentalMetrics?.locationMetrics || []), newLocationMetric]
                }
              }));
            }
          }
        }
      } catch (error) {
        console.error("Unexpected error fetching location metrics:", error);
      }
    };
    
    fetchLocationMetrics();
  }, [formValues, formValues?.reportId, selectedLocationId, locations, setFormValues]);
  
  return {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId
  };
};
