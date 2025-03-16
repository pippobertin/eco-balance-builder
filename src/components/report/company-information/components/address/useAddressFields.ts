
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Province, Municipality } from './types';
import { populateMunicipalitiesForProvince } from '../../utils/locationUtils';

export const useAddressFields = (provinceCode?: string) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<Array<{name: string; postal_codes: string[];}>>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  // Load provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        console.log('Fetching provinces');
        const { data, error } = await supabase
          .from('provinces')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        console.log(`Fetched ${data?.length || 0} provinces`);
        setProvinces(data || []);
      } catch (error: any) {
        console.error('Error loading provinces:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare le province',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    
    fetchProvinces();
  }, []);
  
  // Load cities based on selected province
  useEffect(() => {
    if (!provinceCode) {
      setCities([]);
      setPostalCodes([]);
      return;
    }
    
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        console.log(`Fetching municipalities for province: ${provinceCode}`);
        
        const { data, error } = await supabase
          .from('municipalities')
          .select('*')
          .eq('province_code', provinceCode)
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} municipalities for province ${provinceCode}`);
        
        // If no municipalities found, try to populate them
        if (!data || data.length === 0) {
          console.log(`No municipalities found for province ${provinceCode}, attempting to populate`);
          
          const populateResult = await populateMunicipalitiesForProvince(provinceCode);
          
          if (populateResult) {
            // Fetch municipalities again after populating
            const { data: refreshedData, error: refreshError } = await supabase
              .from('municipalities')
              .select('*')
              .eq('province_code', provinceCode)
              .order('name', { ascending: true });
              
            if (refreshError) {
              throw refreshError;
            }
            
            if (refreshedData && refreshedData.length > 0) {
              console.log(`Successfully populated and fetched ${refreshedData.length} municipalities`);
              
              // Process the refreshed data
              const processedData = processRawMunicipalities(refreshedData);
              setCities(processedData);
              return;
            }
          }
        }
        
        // Process the original data
        const processedData = processRawMunicipalities(data || []);
        setCities(processedData);
      } catch (error: any) {
        console.error('Error loading cities:', error);
        toast({
          title: 'Errore',
          description: 'Impossibile caricare i comuni',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCities(false);
      }
    };
    
    fetchCities();
  }, [provinceCode]);
  
  // Helper function to process raw municipalities data
  const processRawMunicipalities = (rawData: any[]): Array<{name: string; postal_codes: string[]}> => {
    return rawData.map(city => {
      let postalCodesArray: string[] = [];
      
      if (city.postal_codes) {
        if (typeof city.postal_codes === 'string') {
          // Handle comma-separated string
          postalCodesArray = city.postal_codes.split(',').map((code: string) => code.trim());
        } else if (Array.isArray(city.postal_codes)) {
          // Handle array (could be array of strings or objects)
          postalCodesArray = city.postal_codes.map((code: any) => 
            typeof code === 'string' ? code : String(code)
          );
        }
      }
      
      return {
        ...city,
        postal_codes: postalCodesArray
      };
    });
  };
  
  // Update postal codes when city changes
  useEffect(() => {
    setPostalCodes([]);
  }, [cities]);
  
  return {
    provinces,
    cities,
    postalCodes,
    isLoadingProvinces,
    isLoadingCities
  };
};
