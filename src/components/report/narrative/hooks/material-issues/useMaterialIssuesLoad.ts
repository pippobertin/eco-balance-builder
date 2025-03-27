
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';

export const useMaterialIssuesLoad = (
  reportId: string,
  setFormData: React.Dispatch<React.SetStateAction<MaterialIssuesFormData>>,
  setInitialFormData: React.Dispatch<React.SetStateAction<MaterialIssuesFormData>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    if (reportId) {
      loadMaterialIssuesData();
    }
  }, [reportId]);

  const loadMaterialIssuesData = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('narrative_material_issues')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        const loadedData = {
          materialIssuesDescription: data.material_issues_description || ''
        };
        
        // Set both form data and initial form data to track changes
        setFormData(loadedData);
        setInitialFormData(loadedData);
        
        // Set last saved date from the updated_at timestamp
        if (data.updated_at) {
          setLastSaved(new Date(data.updated_at));
        }
        
        // Reset needs saving flag after loading data
        setNeedsSaving(false);
      }
    } catch (error) {
      console.error("Error loading material issues data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { loadMaterialIssuesData };
};
