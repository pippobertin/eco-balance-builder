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
        
        // First, check if we have duplicate entries and clean them up
        const { data: allEntries, error: countError } = await supabase
          .from('narrative_stakeholders')
          .select('*')
          .eq('report_id', reportId);
          
        if (countError) {
          console.error("Error checking stakeholders entries:", countError);
        } else if (allEntries && allEntries.length > 1) {
          // Keep only the most recent entry and delete the rest
          const sortedEntries = [...allEntries].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const latestEntry = sortedEntries[0];
          
          // Delete older entries
          for (let i = 1; i < sortedEntries.length; i++) {
            await supabase
              .from('narrative_stakeholders')
              .delete()
              .eq('id', sortedEntries[i].id);
          }
          
          // Use the latest entry data
          setFormData({
            keyStakeholders: latestEntry.stakeholder_categories || '',
            stakeholderEngagement: latestEntry.engagement_methods || ''
          });
          
          if (latestEntry.updated_at) {
            setLastSaved(new Date(latestEntry.updated_at));
          }
          
          setIsLoading(false);
          return;
        }
        
        // Normal case - fetch single entry
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
