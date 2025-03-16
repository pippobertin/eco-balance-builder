
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Province, Municipality, MunEntity } from './types';
import { ensureLocationDataLoaded, populateMunicipalitiesForProvince } from '../../utils/locationUtils';

export const useAddressFields = (
  province: string,
  city: string
) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    municipalities: false,
    initialization: true
  });

  // Load provinces on hook init and ensure data is loaded
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(prev => ({ ...prev, initialization: true }));
      
      // Ensure location data is loaded in the database
      await ensureLocationDataLoaded();
      
      // Then load provinces
      await loadProvinces();
      
      setIsLoading(prev => ({ ...prev, initialization: false }));
    };
    
    initializeData();
  }, []);

  // Load municipalities when province changes
  useEffect(() => {
    if (province) {
      loadMunicipalities(province);
    } else {
      setMunicipalities([]);
      setPostalCodes([]);
    }
  }, [province]);

  // Load postal codes when municipality changes
  useEffect(() => {
    if (city && municipalities.length > 0) {
      const selectedMunicipality = municipalities.find(m => m.name === city);
      if (selectedMunicipality) {
        setPostalCodes(selectedMunicipality.postal_codes || []);
      } else {
        setPostalCodes([]);
      }
    } else {
      setPostalCodes([]);
    }
  }, [city, municipalities]);

  const loadProvinces = async () => {
    setIsLoading(prev => ({ ...prev, provinces: true }));
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading provinces:', error);
        return;
      }

      setProvinces(data || []);
      console.log(`Loaded ${data?.length} provinces`);
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadMunicipalities = async (provinceCode: string) => {
    setIsLoading(prev => ({ ...prev, municipalities: true }));
    try {
      console.log(`Loading municipalities for province ${provinceCode} from 'municipalities' table`);
      
      // Query the 'municipalities' table
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .eq('province_code', provinceCode)
        .order('name');

      if (error) {
        console.error('Error loading municipalities from municipalities table:', error);
        return;
      }

      console.log(`Loaded ${data?.length} municipalities for province ${provinceCode} from municipalities table`);
      
      // Transform the data to match the Municipality interface
      const transformedData: Municipality[] = data?.map(item => {
        return {
          id: item.id,
          name: item.name || '',
          province_code: item.province_code || '',
          postal_codes: Array.isArray(item.postal_codes) ? item.postal_codes : [item.postal_codes]
        };
      }) || [];
      
      // If no municipalities found after selecting a province, might need to run the population function
      if (transformedData.length === 0) {
        console.log(`No municipalities found for province ${provinceCode}, attempting to populate data`);
        const success = await populateMunicipalitiesForProvince(provinceCode);
        
        if (success) {
          // Try to load municipalities again
          const { data: retryData, error: retryError } = await supabase
            .from('municipalities')
            .select('*')
            .eq('province_code', provinceCode)
            .order('name');
            
          if (retryError) {
            console.error('Error reloading municipalities:', retryError);
            setMunicipalities([]);
            return;
          }
          
          const retryTransformedData: Municipality[] = retryData?.map(item => {
            return {
              id: item.id,
              name: item.name || '',
              province_code: item.province_code || '',
              postal_codes: Array.isArray(item.postal_codes) ? item.postal_codes : [item.postal_codes]
            };
          }) || [];
          
          setMunicipalities(retryTransformedData);
          console.log(`Reloaded ${retryTransformedData.length} municipalities for province ${provinceCode}`);
        } else {
          setMunicipalities([]);
        }
      } else {
        setMunicipalities(transformedData);
      }
    } catch (error) {
      console.error('Failed to load municipalities:', error);
      setMunicipalities([]);
    } finally {
      setIsLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  return {
    provinces,
    municipalities,
    postalCodes,
    isLoading
  };
};
