
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AddressData } from './types';

export const useAddressFields = (initialData?: Partial<AddressData>) => {
  const [addressData, setAddressData] = useState<Partial<AddressData>>(initialData || {});
  const [provinces, setProvinces] = useState<Array<{code: string; name: string}>>([]);
  const [cities, setCities] = useState<Array<{name: string; postal_codes: string | string[];}>>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  
  // Load provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const { data, error } = await supabase
          .from('provinces')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
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
    if (!addressData.address_province) {
      setCities([]);
      return;
    }
    
    const fetchCities = async () => {
      setIsLoadingCities(true);
      try {
        console.log(`Fetching municipalities for province: ${addressData.address_province}`);
        
        const { data, error } = await supabase
          .from('municipalities')
          .select('*')
          .eq('province_code', addressData.address_province)
          .order('name', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        console.log(`Found ${data?.length || 0} municipalities for province ${addressData.address_province}`);
        
        // Ensure postal_codes is treated consistently as an array
        const processedData = (data || []).map(city => ({
          ...city,
          postal_codes: typeof city.postal_codes === 'string' 
            ? city.postal_codes.split(',') 
            : city.postal_codes || []
        }));
        
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
  }, [addressData.address_province]);
  
  // Set postal code based on city selection if available
  useEffect(() => {
    if (addressData.address_city && cities.length > 0) {
      const selectedCity = cities.find(city => city.name === addressData.address_city);
      
      if (selectedCity && selectedCity.postal_codes && 
          Array.isArray(selectedCity.postal_codes) && 
          selectedCity.postal_codes.length > 0) {
        // Get first postal code if there are multiple
        const postalCode = Array.isArray(selectedCity.postal_codes) 
          ? selectedCity.postal_codes[0] 
          : selectedCity.postal_codes;
        
        if (postalCode && (!addressData.address_postal_code || addressData.address_postal_code === '')) {
          setAddressData(prev => ({
            ...prev,
            address_postal_code: postalCode
          }));
        }
      }
    }
  }, [addressData.address_city, cities]);
  
  const handleChange = (name: keyof AddressData, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset dependent fields
    if (name === 'address_province') {
      setAddressData(prev => ({
        ...prev,
        address_city: '',
        address_postal_code: ''
      }));
    }
  };
  
  return {
    addressData,
    provinces,
    cities,
    isLoadingProvinces,
    isLoadingCities,
    handleChange
  };
};
