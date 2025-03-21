
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { AntiCorruptionData } from './types';

export const useAntiCorruptionLoad = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [antiCorruptionData, setAntiCorruptionData] = useState<AntiCorruptionData | null>(null);

  // Load anti-corruption data
  const loadAntiCorruptionData = useCallback(async () => {
    if (!reportId) {
      console.log("Cannot load anti-corruption data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading anti-corruption data for report:", reportId);
      
      const { data, error } = await supabase
        .from('anti_corruption_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Anti-corruption data loaded:", data);
      
      if (data) {
        const formattedData: AntiCorruptionData = {
          convictionsNumber: data.convictions_number,
          sanctionsAmount: data.sanctions_amount,
          additionalDetails: data.additional_details
        };
        
        setAntiCorruptionData(formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading anti-corruption data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati anticorruzione");
      return null;
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  return {
    loading,
    antiCorruptionData,
    setAntiCorruptionData,
    loadAntiCorruptionData
  };
};
