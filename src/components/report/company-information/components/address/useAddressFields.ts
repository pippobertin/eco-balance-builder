
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Province } from './types';

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
        
        // Ensure postal_codes is treated consistently as an array
        const processedData = (data || []).map(city => {
          let postalCodesArray: string[] = [];
          
          if (city.postal_codes) {
            if (typeof city.postal_codes === 'string') {
              postalCodesArray = city.postal_codes.split(',');
            } else if (Array.isArray(city.postal_codes)) {
              postalCodesArray = city.postal_codes;
            }
          }
          
          return {
            ...city,
            postal_codes: postalCodesArray
          };
        });
        
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
