
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PollutionMedium, PollutantType, PollutionRecord } from './types';

export const usePollutionFetch = (reportId?: string) => {
  const [mediums, setMediums] = useState<PollutionMedium[]>([]);
  const [pollutants, setPollutants] = useState<PollutantType[]>([]);
  const [records, setRecords] = useState<PollutionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all release mediums
  const fetchMediums = async () => {
    try {
      const { data, error } = await supabase
        .from('pollution_release_mediums')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Use explicit type assertion to help TypeScript understand the data structure
      setMediums(data as PollutionMedium[]);
    } catch (error) {
      console.error('Error fetching pollution mediums:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i mezzi di rilascio inquinanti',
        variant: 'destructive',
      });
    }
  };

  // Fetch all pollutant types
  const fetchPollutants = async () => {
    try {
      const { data, error } = await supabase
        .from('pollutant_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Use explicit type assertion
      setPollutants(data as PollutantType[]);
    } catch (error) {
      console.error('Error fetching pollutant types:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i tipi di inquinanti',
        variant: 'destructive',
      });
    }
  };

  // Fetch pollution records for this report
  const fetchRecords = async () => {
    if (!reportId) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pollution_records')
        .select(`
          *,
          pollutant_types (name, description),
          pollution_release_mediums (name)
        `)
        .eq('report_id', reportId);
      
      if (error) throw error;
      
      // Use explicit type assertion
      setRecords(data as PollutionRecord[]);
    } catch (error) {
      console.error('Error fetching pollution records:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i dati sugli inquinanti',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mediums,
    setMediums,
    pollutants, 
    setPollutants,
    records,
    setRecords,
    isLoading,
    setIsLoading,
    fetchMediums,
    fetchPollutants,
    fetchRecords
  };
};
