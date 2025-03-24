
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StakeholdersFormData } from '../types';

export const useStakeholdersLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StakeholdersFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (reportId) {
      loadStakeholdersData();
    }
  }, [reportId]);

  const loadStakeholdersData = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('narrative_stakeholders')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setFormData({
          keyStakeholders: data.stakeholder_categories || '',
          stakeholderEngagement: data.engagement_methods || ''
        });
        
        // Set last saved date from the updated_at timestamp
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
        
        // Reset needs saving flag after loading data
        setNeedsSaving(false);
      }
    } catch (error) {
      console.error("Error loading stakeholders data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadStakeholdersData };
};
