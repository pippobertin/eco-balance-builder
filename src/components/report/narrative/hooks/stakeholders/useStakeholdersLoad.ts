
import { useEffect } from 'react';
import { StakeholdersFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStakeholdersLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StakeholdersFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('narrative_stakeholders')
          .select('*')
          .eq('report_id', reportId)
          .single();

        if (error) {
          console.error('Error fetching stakeholders data:', error);
          return;
        }

        if (data) {
          setFormData({
            keyStakeholders: data.stakeholder_categories || '',
            stakeholderEngagement: data.engagement_methods || ''
          });
        }
      } catch (error) {
        console.error('Error loading stakeholders data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading]);
};
