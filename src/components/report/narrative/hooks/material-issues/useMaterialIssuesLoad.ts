
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
        
        // Get all entries to check for duplicates
        const { data: allEntries, error: countError } = await supabase
          .from('narrative_material_issues')
          .select('*')
          .eq('report_id', reportId);
          
        if (countError) {
          console.error("Error checking material issues entries:", countError);
          throw countError;
        }
        
        // If there are duplicates, we should handle them in the database with SQL
        if (allEntries && allEntries.length > 1) {
          console.warn(`Found ${allEntries.length} material issues entries for report ${reportId} - using most recent`);
          
          // For now, just use the most recent entry (we'll clean up duplicates with SQL)
          const sortedEntries = [...allEntries].sort((a, b) => 
            new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime()
          );
          
          const latestEntry = sortedEntries[0];
          
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
