
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { SupplyChainData } from './types';

export const useSupplyChainLoad = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainData | null>(null);

  // Load supply chain data
  const loadSupplyChainData = useCallback(async () => {
    if (!reportId) {
      console.log("Cannot load supply chain data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading supply chain data for report:", reportId);
      
      const { data, error } = await supabase
        .from('supply_chain_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Supply chain data loaded:", data);
      
      if (data) {
        const formattedData: SupplyChainData = {
          impactProcessDescription: data.impact_process_description,
          identifiedImpacts: data.identified_impacts
        };
        
        setSupplyChainData(formattedData);
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading supply chain data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati della catena del valore");
      return null;
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  return {
    loading,
    supplyChainData,
    setSupplyChainData,
    loadSupplyChainData
  };
};
