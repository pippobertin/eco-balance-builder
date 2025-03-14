
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Province, Municipality } from './types';

export const useAddressFields = (
  province: string,
  city: string
) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    municipalities: false
  });

  // Load provinces on hook init
  useEffect(() => {
    loadProvinces();
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
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadMunicipalities = async (provinceCode: string) => {
    setIsLoading(prev => ({ ...prev, municipalities: true }));
    try {
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .eq('province_code', provinceCode)
        .order('name');

      if (error) {
        console.error('Error loading municipalities:', error);
        return;
      }

      setMunicipalities(data || []);
    } catch (error) {
      console.error('Failed to load municipalities:', error);
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
