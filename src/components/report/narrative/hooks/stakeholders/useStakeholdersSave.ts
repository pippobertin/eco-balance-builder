
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StakeholdersFormData } from '../types';
import { toast } from 'sonner';

export const useStakeholdersSave = (
  reportId: string, 
  formData: StakeholdersFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveData = useCallback(async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      // First, check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_stakeholders')
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
          .from('narrative_stakeholders')
          .update({
            stakeholder_categories: formData.keyStakeholders,
            engagement_methods: formData.stakeholderEngagement,
            updated_at: now
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('narrative_stakeholders')
          .insert({
            report_id: reportId,
            stakeholder_categories: formData.keyStakeholders,
            engagement_methods: formData.stakeholderEngagement,
            updated_at: now
          });
      }

      if (result.error) {
        throw result.error;
      }

      // Only update this module's state
      setLastSaved(new Date());
      toast.success('Dati salvati con successo');
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setLastSaved]);

  return { saveData, isSaving };
};
