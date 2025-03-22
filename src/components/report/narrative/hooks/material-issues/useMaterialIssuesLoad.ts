
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
