
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { IssuesManagementFormData } from '../types';

export const useIssuesManagementLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<IssuesManagementFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (reportId) {
      loadIssuesManagementData();
    }
  }, [reportId]);

  const loadIssuesManagementData = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('narrative_issues_management')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setFormData({
          policiesActions: data.policies_actions || '',
          policiesDescription: data.policies_description || '',
          actionsDescription: data.actions_description || '',
          energyEfficiencyActions: data.energy_efficiency_actions || '',
          stakeholdersImpacts: data.stakeholders_impacts || '',
          antiCorruptionMeasures: data.anti_corruption_measures || ''
        });
        
        // Set last saved date from the updated_at timestamp
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
        
        // Reset needs saving flag after loading data
        setNeedsSaving(false);
      }
    } catch (error) {
      console.error("Error loading issues management data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadIssuesManagementData };
};
