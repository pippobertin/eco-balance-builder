
import { useEffect } from 'react';
import { GovernanceFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGovernanceLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<GovernanceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        const { data, error } = await supabase
          .from('narrative_governance')
          .select('*')
          .eq('report_id', reportId)
          .single();

        if (error) {
          console.error('Error fetching governance data:', error);
          return;
        }

        if (data) {
          setFormData({
            sustainabilityGovernance: data.sustainability_governance || ''
          });
        }
      } catch (error) {
        console.error('Error loading governance data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading]);
};
