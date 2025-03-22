
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useMaterialIssuesSave = (
  reportId: string, 
  formData: MaterialIssuesFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      console.log('Saving material issues data for report:', reportId);
      
      // First, check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_material_issues')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const now = new Date().toISOString();
      
      let result;
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('narrative_material_issues')
          .update({
            material_issues_description: formData.materialIssuesDescription,
            updated_at: now
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('narrative_material_issues')
          .insert({
            report_id: reportId,
            material_issues_description: formData.materialIssuesDescription,
            updated_at: now
          });
      }
      
      if (result.error) {
        throw result.error;
      }

      const newSavedTime = new Date();
      setLastSaved(newSavedTime);
      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error: any) {
      console.error('Error in save operation:', error);
      toast.error(`Errore durante il salvataggio: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving };
};
