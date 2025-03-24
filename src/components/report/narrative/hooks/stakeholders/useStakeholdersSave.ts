
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StakeholdersFormData } from '../types';
import { useSaveFeedback } from '@/components/report/hooks/useSaveFeedback';

export const useStakeholdersSave = (
  reportId: string, 
  formData: StakeholdersFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const saveOperation = useCallback(async () => {
    if (!reportId) return;
    
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
  }, [reportId, formData]);

  // Use the common save feedback hook
  const { saveWithFeedback, isSaving } = useSaveFeedback({
    setLastSaved,
    saveOperation
  });

  return { saveData: saveWithFeedback, isSaving };
};
