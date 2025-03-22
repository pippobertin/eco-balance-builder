
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GovernanceFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useGovernanceSave = (reportId: string, formData: GovernanceFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('narrative_governance')
        .upsert({
          report_id: reportId,
          sustainability_governance: formData.sustainabilityGovernance,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving governance data:', error);
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
