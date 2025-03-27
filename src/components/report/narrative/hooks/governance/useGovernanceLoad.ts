
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GovernanceFormData } from '../types';

export const useGovernanceLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<GovernanceFormData>>,
  setInitialFormData: React.Dispatch<React.SetStateAction<GovernanceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (reportId) {
      loadGovernanceData();
    }
  }, [reportId]);

  const loadGovernanceData = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('narrative_governance')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        const loadedData = {
          sustainabilityGovernance: data.sustainability_governance || ''
        };
        
        // Set both form data and initial form data to track changes
        setFormData(loadedData);
        setInitialFormData(loadedData);
        
        // Set last saved date from the updated_at timestamp
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
        
        // Reset needs saving flag after loading data
        setNeedsSaving(false);
      }
    } catch (error) {
      console.error("Error loading governance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadGovernanceData };
};
