
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useMaterialIssuesSave = (reportId: string, formData: MaterialIssuesFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('narrative_material_issues')
        .upsert({
          report_id: reportId,
          material_issues_description: formData.materialIssuesDescription,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving material issues data:', error);
        toast.error('Errore durante il salvataggio');
        return;
      }

      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving };
};
