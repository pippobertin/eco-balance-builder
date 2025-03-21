
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type PollutionMedium = {
  id: number;
  name: string;
};

export type PollutantType = {
  id: number;
  name: string;
  description: string;
  release_medium_ids: number[];
};

export type PollutionRecord = {
  id?: string;
  report_id: string;
  pollutant_type_id: number;
  release_medium_id: number;
  quantity: number;
  unit: string;
  details?: string;
  created_at?: string;
};

export const usePollutionData = (reportId?: string) => {
  const [mediums, setMediums] = useState<PollutionMedium[]>([]);
  const [pollutants, setPollutants] = useState<PollutantType[]>([]);
  const [records, setRecords] = useState<PollutionRecord[]>([]);
  const [filteredPollutants, setFilteredPollutants] = useState<PollutantType[]>([]);
  const [selectedMedium, setSelectedMedium] = useState<number | null>(null);
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

  // Add a new pollution record
  const addRecord = async (record: PollutionRecord): Promise<PollutionRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('pollution_records')
        .insert([record])
        .select(`
          *,
          pollutant_types (name, description),
          pollution_release_mediums (name)
        `);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setRecords(prev => [...prev, data[0] as PollutionRecord]);
        toast({
          title: 'Successo',
          description: 'Inquinante aggiunto con successo',
        });
        return data[0] as PollutionRecord;
      }
      return null;
    } catch (error) {
      console.error('Error adding pollution record:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile aggiungere l\'inquinante',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Delete a pollution record
  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('pollution_records')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRecords(prev => prev.filter(record => record.id !== id));
      toast({
        title: 'Successo',
        description: 'Inquinante rimosso con successo',
      });
      return true;
    } catch (error) {
      console.error('Error deleting pollution record:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile rimuovere l\'inquinante',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Filter pollutants based on selected medium
  useEffect(() => {
    if (selectedMedium && pollutants.length > 0) {
      // Filter pollutants that can be released in the selected medium
      const filtered = pollutants.filter(pollutant => 
        pollutant.release_medium_ids && 
        pollutant.release_medium_ids.includes(selectedMedium)
      );
      setFilteredPollutants(filtered);
    } else {
      setFilteredPollutants([]);
    }
  }, [selectedMedium, pollutants]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMediums(), fetchPollutants()]);
      if (reportId) {
        await fetchRecords();
      }
      setIsLoading(false);
    };
    
    loadData();
  }, [reportId]);

  return {
    mediums,
    pollutants,
    filteredPollutants,
    records,
    isLoading,
    selectedMedium,
    setSelectedMedium,
    addRecord,
    deleteRecord,
    refreshRecords: fetchRecords
  };
};
