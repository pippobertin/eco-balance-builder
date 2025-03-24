
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GovernanceFormData } from '../types';
import { useSaveFeedback } from '@/components/report/hooks/useSaveFeedback';

export const useGovernanceSave = (
  reportId: string, 
  formData: GovernanceFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const saveOperation = useCallback(async () => {
    if (!reportId) return;
    
    // First, check if a record already exists
    const { data: existingData, error: checkError } = await supabase
      .from('narrative_governance')
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
        .from('narrative_governance')
        .update({
          sustainability_governance: formData.sustainabilityGovernance,
          updated_at: now
        })
        .eq('id', existingData.id);
    } else {
      // Insert new record
      result = await supabase
        .from('narrative_governance')
        .insert({
          report_id: reportId,
          sustainability_governance: formData.sustainabilityGovernance,
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
