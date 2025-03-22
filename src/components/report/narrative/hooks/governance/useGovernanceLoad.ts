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
        
        // First, check if we have duplicate entries and clean them up
        const { data: allEntries, error: countError } = await supabase
          .from('narrative_governance')
          .select('*')
          .eq('report_id', reportId);
          
        if (countError) {
          console.error("Error checking governance entries:", countError);
        } else if (allEntries && allEntries.length > 1) {
          // Keep only the most recent entry and delete the rest
          const sortedEntries = [...allEntries].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const latestEntry = sortedEntries[0];
          
          // Delete older entries
          for (let i = 1; i < sortedEntries.length; i++) {
            await supabase
              .from('narrative_governance')
              .delete()
              .eq('id', sortedEntries[i].id);
          }
          
          // Use the latest entry data
          setFormData({
            sustainabilityGovernance: latestEntry.sustainability_governance || ''
          });
          
          if (latestEntry.updated_at) {
            setLastSaved(new Date(latestEntry.updated_at));
          }
          
          setIsLoading(false);
          return;
        }
        
        // Normal case - fetch single entry
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
