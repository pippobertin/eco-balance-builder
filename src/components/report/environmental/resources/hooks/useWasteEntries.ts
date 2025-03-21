
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WasteEntry {
  id: string;
  waste_type: 'hazardous' | 'non-hazardous';
  waste_description: string;
  total_waste: number | null;
  recycled_waste: number | null;
  disposal_waste: number | null;
}

export const useWasteEntries = (reportId: string | undefined) => {
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEntries = async () => {
    if (!reportId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('waste_management')
        .select('*')
        .eq('report_id', reportId)
        .order('waste_type', { ascending: false })
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setEntries(data as WasteEntry[]);
    } catch (error: any) {
      console.error("Error fetching waste entries:", error);
      toast({
        title: "Errore",
        description: `Errore nel caricamento dei dati sui rifiuti: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [reportId]);

  return {
    entries,
    loading,
    hazardousEntries: entries.filter(entry => entry.waste_type === 'hazardous'),
    nonHazardousEntries: entries.filter(entry => entry.waste_type === 'non-hazardous'),
    refresh: fetchEntries
  };
};
