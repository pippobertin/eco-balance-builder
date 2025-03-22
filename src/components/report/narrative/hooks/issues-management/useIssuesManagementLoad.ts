
import { useEffect } from 'react';
import { IssuesManagementFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useIssuesManagementLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<IssuesManagementFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('narrative_issues_management')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching issues management data:', error);
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
          
          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
          }
        } else {
          setFormData({
            policiesActions: '',
            policiesDescription: '',
            actionsDescription: '',
            energyEfficiencyActions: '',
            stakeholdersImpacts: '',
            antiCorruptionMeasures: ''
          });
          setLastSaved(null);
        }
      } catch (error) {
        console.error('Error loading issues management data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading, setLastSaved]);
};
