
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialIssuesFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useMaterialIssuesSave = (reportId: string, formData: MaterialIssuesFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      console.log('Saving material issues data for report:', reportId);
      
      const { error } = await supabase
        .from('narrative_material_issues')
        .upsert({
          report_id: reportId,
          material_issues_description: formData.materialIssuesDescription,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'report_id'
        });

      if (error) {
        console.error('Error saving material issues data:', error);
        toast.error('Errore durante il salvataggio');
        return;
      }

      const newSavedTime = new Date();
      setLastSaved(newSavedTime);
      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving, lastSaved };
};
