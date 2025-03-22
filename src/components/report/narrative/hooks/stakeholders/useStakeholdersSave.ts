
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StakeholdersFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useStakeholdersSave = (reportId: string, formData: StakeholdersFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('narrative_stakeholders')
        .upsert({
          report_id: reportId,
          stakeholder_categories: formData.keyStakeholders,
          engagement_methods: formData.stakeholderEngagement,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving stakeholders data:', error);
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
