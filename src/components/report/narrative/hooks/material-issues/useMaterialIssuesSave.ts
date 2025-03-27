
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';
import { useSaveFeedback } from '@/components/report/hooks/useSaveFeedback';

export const useMaterialIssuesSave = (
  reportId: string,
  formData: MaterialIssuesFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>,
  setInitialFormData: React.Dispatch<React.SetStateAction<MaterialIssuesFormData>>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const saveOperation = useCallback(async () => {
    if (!reportId) return;

    // First check if a record already exists for this report
    const { data: existingData, error: checkError } = await supabase
      .from('narrative_material_issues')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingData) {
      // Update existing record
      console.log("Updating existing material issues record");
      const { error } = await supabase
        .from('narrative_material_issues')
        .update({
          material_issues_description: formData.materialIssuesDescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
        
      if (error) throw error;
    } else {
      // Insert new record
      console.log("Creating new material issues record");
      const { error } = await supabase
        .from('narrative_material_issues')
        .insert({
          report_id: reportId,
          material_issues_description: formData.materialIssuesDescription,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    }
    
    // Update initialFormData after successful save
    setInitialFormData({...formData});
    // Reset needsSaving flag
    setNeedsSaving(false);
  }, [reportId, formData, setInitialFormData, setNeedsSaving]);

  // Use the common save feedback hook
  const { saveWithFeedback, isSaving } = useSaveFeedback({
    setLastSaved,
    saveOperation
  });

  return { saveData: saveWithFeedback, isSaving };
};
