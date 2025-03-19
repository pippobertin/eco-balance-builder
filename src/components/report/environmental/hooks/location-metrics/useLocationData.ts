
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';
import { LocationEnvironmentalMetrics } from '@/context/types';
import { useToast } from '@/hooks/use-toast';
import { safeJsonStringify } from '@/integrations/supabase/utils/jsonUtils';

export const useLocationData = (
  companyId: string | undefined, 
  formValues: any, 
  setFormValues: React.Dispatch<React.SetStateAction<any>>,
  reportId?: string
) => {
  const { toast } = useToast();
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
          
          if (reportId) {
            // Load location metrics from database
            await loadLocationMetricsFromDatabase(reportId, allLocations);
          } else {
            // Fallback to initializing from form values
            initializeLocationMetrics(allLocations, formValues, setFormValues);
          }
          
          if (!selectedLocationId && allLocations.length > 0) {
            setSelectedLocationId(allLocations[0].id || 'main-location');
          }
        }
      } catch (error) {
        console.error('Error loading company locations:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le sedi dell'azienda",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, [companyId, reportId]);

  // Load location metrics from database
  const loadLocationMetricsFromDatabase = async (reportId: string, locationData: CompanyLocation[]) => {
    try {
      const { data, error } = await supabase
        .from('location_metrics')
        .select('*')
        .eq('report_id', reportId);
        
      if (error) {
        console.error("Error loading location metrics:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati ambientali delle sedi",
          variant: "destructive"
        });
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Loaded location metrics from database:", data.length);
        
        // Format the data for the form
        const locationMetrics = data.map(item => ({
          location_id: item.location_id,
          location_name: item.location_name,
          location_type: item.location_type,
          metrics: item.metrics ? JSON.parse(item.metrics) : {}
        }));
        
        // Update the form values
        setFormValues((prev: any) => ({
          ...prev,
          environmentalMetrics: {
            ...prev.environmentalMetrics,
            locationMetrics: locationMetrics
          }
        }));
      } else {
        // Initialize from the location data
        initializeLocationMetrics(locationData, formValues, setFormValues);
      }
    } catch (error) {
      console.error("Error loading location metrics from database:", error);
      // Fallback to initializing from location data
      initializeLocationMetrics(locationData, formValues, setFormValues);
    }
  };

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
      
      // If report ID is provided, save to database
      if (reportId) {
        saveLocationMetricsToDatabase(reportId, updatedLocationMetrics);
      }
    }
  };
  
  // Save location metrics to database
  const saveLocationMetricsToDatabase = async (reportId: string, locationMetrics: LocationEnvironmentalMetrics[]) => {
    try {
      // Prepare the data for insertion
      const dataToInsert = locationMetrics.map(lm => ({
        report_id: reportId,
        location_id: lm.location_id,
        location_name: lm.location_name,
        location_type: lm.location_type,
        metrics: safeJsonStringify(lm.metrics),
        updated_at: new Date().toISOString()
      }));
      
      // Insert or update the location metrics
      const { error } = await supabase
        .from('location_metrics')
        .upsert(dataToInsert, { onConflict: 'report_id,location_id' });
        
      if (error) {
        throw error;
      }
      
      console.log("Location metrics saved to database successfully");
    } catch (error) {
      console.error("Error saving location metrics to database:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati ambientali delle sedi",
        variant: "destructive"
      });
    }
  };

  return {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId,
    saveLocationMetrics: (reportId: string, locationMetrics: LocationEnvironmentalMetrics[]) => 
      saveLocationMetricsToDatabase(reportId, locationMetrics)
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
