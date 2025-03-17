
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Province, Municipality } from './types';

export const useAddressData = (initialProvince: string = '') => {
  const { toast } = useToast();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState({
    provinces: false,
    municipalities: false
  });
  const [databaseStatus, setDatabaseStatus] = useState<'empty' | 'loading' | 'loaded' | 'error'>('loading');
  const [populatingData, setPopulatingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if provinces data exists on component mount
  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  // Load provinces once database is confirmed to have data
  useEffect(() => {
    if (databaseStatus === 'loaded') {
      loadProvinces();
    }
  }, [databaseStatus]);

  // Load municipalities when province changes
  useEffect(() => {
    if (initialProvince && databaseStatus === 'loaded') {
      loadMunicipalities(initialProvince);
    } else {
      setMunicipalities([]);
      setPostalCodes([]);
    }
  }, [initialProvince, databaseStatus]);

  const checkDatabaseStatus = async () => {
    setDatabaseStatus('loading');
    setError(null);
    try {
      // Check if provinces table has data
      const { count, error } = await supabase
        .from('provinces')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      if (count && count > 0) {
        setDatabaseStatus('loaded');
        console.log(`Database contiene ${count} province`);
      } else {
        setDatabaseStatus('empty');
        console.log('Database province vuoto');
      }
    } catch (error) {
      console.error('Error checking database status:', error);
      setDatabaseStatus('error');
      setError('Errore durante la verifica dello stato del database');
    }
  };

  const populateLocationData = async () => {
    setPopulatingData(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke('populate-italian-locations');
      
      if (error) {
        throw error;
      }

      console.log('Population result:', data);
      
      if (data.message?.includes('already populated')) {
        toast({
          title: 'Dati già presenti',
          description: 'Il database contiene già i dati delle località italiane.',
        });
      } else {
        toast({
          title: 'Dati caricati con successo',
          description: `Sono state caricate ${data.provinces_count} province e ${data.municipalities_count} comuni.`,
        });
      }
      
      // Refresh database status
      await checkDatabaseStatus();
      
      // If data is now loaded, load provinces
      if (databaseStatus === 'loaded') {
        await loadProvinces();
      }
    } catch (error) {
      console.error('Error populating location data:', error);
      setError('Errore durante il caricamento dei dati delle località');
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante il caricamento dei dati delle località.',
        variant: 'destructive',
      });
    } finally {
      setPopulatingData(false);
    }
  };

  const loadProvinces = async () => {
    setIsLoading(prev => ({ ...prev, provinces: true }));
    setError(null);
    try {
      const { data, error } = await supabase
        .from('provinces')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading provinces:', error);
        setError('Errore durante il caricamento delle province');
        return;
      }

      console.log(`Caricate ${data?.length || 0} province`);
      setProvinces(data || []);
    } catch (error) {
      console.error('Failed to load provinces:', error);
      setError('Errore durante il caricamento delle province');
    } finally {
      setIsLoading(prev => ({ ...prev, provinces: false }));
    }
  };

  const loadMunicipalities = async (provinceCode: string) => {
    setIsLoading(prev => ({ ...prev, municipalities: true }));
    setError(null);
    try {
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .eq('province_code', provinceCode)
        .order('name');

      if (error) {
        console.error('Error loading municipalities:', error);
        setError(`Errore durante il caricamento dei comuni per la provincia ${provinceCode}`);
        return;
      }

      console.log(`Loaded ${data?.length || 0} municipalities for province ${provinceCode}`);
      setMunicipalities(data || []);
    } catch (error) {
      console.error('Failed to load municipalities:', error);
      setError(`Errore durante il caricamento dei comuni per la provincia ${provinceCode}`);
    } finally {
      setIsLoading(prev => ({ ...prev, municipalities: false }));
    }
  };

  const updatePostalCodes = (cityName: string) => {
    if (cityName && municipalities.length > 0) {
      const selectedMunicipality = municipalities.find(m => m.name === cityName);
      if (selectedMunicipality) {
        setPostalCodes(selectedMunicipality.postal_codes || []);
        return selectedMunicipality.postal_codes;
      }
    }
    setPostalCodes([]);
    return [];
  };

  return {
    provinces,
    municipalities,
    postalCodes,
    isLoading,
    databaseStatus,
    populatingData,
    error,
    checkDatabaseStatus,
    populateLocationData,
    loadProvinces,
    loadMunicipalities,
    updatePostalCodes
  };
};
