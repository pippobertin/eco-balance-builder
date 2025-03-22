
import { useEffect } from 'react';
import { GovernanceFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGovernanceLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<GovernanceFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('narrative_governance')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching governance data:', error);
          throw error;
        }

        if (data) {
          setFormData({
            sustainabilityGovernance: data.sustainability_governance || ''
          });
          
          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
          }
        } else {
          setFormData({
            sustainabilityGovernance: ''
          });
          setLastSaved(null);
        }
      } catch (error) {
        console.error('Error loading governance data:', error);
        toast.error('Errore nel caricamento dei dati');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId, setFormData, setIsLoading, setLastSaved]);
};
