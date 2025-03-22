
import { useEffect } from 'react';
import { StakeholdersFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStakeholdersLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<StakeholdersFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('narrative_stakeholders')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching stakeholders data:', error);
          throw error;
        }

        if (data) {
          setFormData({
            keyStakeholders: data.stakeholder_categories || '',
            stakeholderEngagement: data.engagement_methods || ''
          });
          
          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
          }
        } else {
          setFormData({
            keyStakeholders: '',
            stakeholderEngagement: ''
          });
          setLastSaved(null);
        }
      } catch (error) {
        console.error('Error loading stakeholders data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading, setLastSaved]);
};
