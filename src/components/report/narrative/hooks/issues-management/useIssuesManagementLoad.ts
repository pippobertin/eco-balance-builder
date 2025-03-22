
import { useEffect } from 'react';
import { IssuesManagementFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useIssuesManagementLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<IssuesManagementFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('narrative_issues_management')
          .select('*')
          .eq('report_id', reportId)
          .single();

        if (error) {
          console.error('Error fetching issues management data:', error);
          return;
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
        }
      } catch (error) {
        console.error('Error loading issues management data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading]);
};
