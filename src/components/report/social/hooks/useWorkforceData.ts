
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWorkforceData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [workforceData, setWorkforceData] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load workforce data
  const loadWorkforceData = async () => {
    if (!reportId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('workforce_distribution')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setWorkforceData(data);
        setLastSaved(new Date(data.updated_at));
        return data;
      }
      
    } catch (error: any) {
      console.error("Error loading workforce data:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati della forza lavoro",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  // Initial data load
  useEffect(() => {
    if (reportId) {
      loadWorkforceData();
    }
  }, [reportId]);

  return {
    loading,
    workforceData,
    loadWorkforceData,
    lastSaved
  };
};
