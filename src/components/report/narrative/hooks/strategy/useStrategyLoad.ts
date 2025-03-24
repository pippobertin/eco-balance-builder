
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';

export const useStrategyLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StrategyFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (reportId) {
      loadStrategyData();
    }
  }, [reportId]);

  const loadStrategyData = async () => {
    setIsLoading(true);
    console.log("Loading strategy data for report:", reportId);

    try {
      const { data, error } = await supabase
        .from('narrative_strategy')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
        console.error("Error loading strategy data:", error);
        throw error;
      }
      
      console.log("Strategy data loaded:", data);
      
      if (data) {
        setFormData({
          productsServices: data.products_services || '',
          markets: data.markets || '',
          businessRelations: data.business_relations || '',
          sustainabilityStrategy: data.sustainability_strategy || ''
        });
        
        // Set last saved date from the updated_at timestamp
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
        
        // Reset needs saving flag after loading data
        setNeedsSaving(false);
      }
    } catch (error) {
      console.error("Error in loadStrategyData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadStrategyData };
};
