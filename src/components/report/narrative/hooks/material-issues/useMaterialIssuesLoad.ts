import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesAPIData, MaterialIssuesFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

export const useMaterialIssuesLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<MaterialIssuesFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!reportId) return;
      
      try {
        setIsLoading(true);
        
        // First, check if we have duplicate entries and clean them up
        const { data: allEntries, error: countError } = await supabase
          .from('narrative_material_issues')
          .select('*')
          .eq('report_id', reportId);
          
        if (countError) {
          console.error("Error checking material issues entries:", countError);
        } else if (allEntries && allEntries.length > 1) {
          // Keep only the most recent entry and delete the rest
          const sortedEntries = [...allEntries].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const latestEntry = sortedEntries[0];
          
          // Delete older entries
          for (let i = 1; i < sortedEntries.length; i++) {
            await supabase
              .from('narrative_material_issues')
              .delete()
              .eq('id', sortedEntries[i].id);
          }
          
          // Use the latest entry data
          const apiData = latestEntry as MaterialIssuesAPIData;
          setFormData({
            materialIssuesDescription: apiData.material_issues_description || ''
          });
          
          if (apiData.updated_at) {
            setLastSaved(new Date(apiData.updated_at));
          }
          
          setIsLoading(false);
          return;
        }
        
        // Normal case - fetch single entry
        const { data, error } = await supabase
          .from('narrative_material_issues')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const apiData = data as MaterialIssuesAPIData;
          setFormData({
            materialIssuesDescription: apiData.material_issues_description || ''
          });
          
          if (apiData.updated_at) {
            setLastSaved(new Date(apiData.updated_at));
          }
        } else {
          setFormData({
            materialIssuesDescription: ''
          });
          setLastSaved(null);
        }
      } catch (error: any) {
        console.error('Error loading material issues data:', error.message);
        toast({
          title: "Errore",
          description: `Impossibile caricare i dati delle questioni materiali: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (reportId) {
      loadData();
    }
  }, [reportId, setFormData, setIsLoading, setLastSaved, toast]);
};
