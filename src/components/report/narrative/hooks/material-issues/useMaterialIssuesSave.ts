
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useMaterialIssuesSave = (reportId: string, formData: MaterialIssuesFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { setNeedsSaving, setLastSaved } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);
    
    try {
      // Transform form data to API format
      const apiData = {
        report_id: reportId,
        material_issues_description: formData.materialIssuesDescription || null
      };
      
      // Check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_material_issues')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('narrative_material_issues')
          .update(apiData)
          .eq('id', existingData.id);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('narrative_material_issues')
          .insert([apiData]);
          
        if (insertError) {
          throw insertError;
        }
      }
      
      // Successfully saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Salvato",
        description: "Le questioni materiali sono state salvate con successo."
      });
      
    } catch (error: any) {
      console.error('Error saving material issues data:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare le questioni materiali: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    saveData,
    isSaving
  };
};
