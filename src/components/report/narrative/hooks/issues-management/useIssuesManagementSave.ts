
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { IssuesManagementFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useIssuesManagementSave = (reportId: string, formData: IssuesManagementFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('narrative_issues_management')
        .upsert({
          report_id: reportId,
          policies_actions: formData.policiesActions,
          policies_description: formData.policiesDescription,
          actions_description: formData.actionsDescription,
          energy_efficiency_actions: formData.energyEfficiencyActions,
          stakeholders_impacts: formData.stakeholdersImpacts,
          anti_corruption_measures: formData.antiCorruptionMeasures,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error saving issues management data:', error);
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
