
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { useSaveFeedback } from '@/components/report/hooks/useSaveFeedback';

export const useStrategySave = (
  reportId: string,
  formData: StrategyFormData,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const saveOperation = useCallback(async () => {
    if (!reportId) return;

    console.log("Saving strategy data for report:", reportId);
    
    // First check if a record already exists for this report
    const { data: existingData, error: checkError } = await supabase
      .from('narrative_strategy')
      .select('id')
      .eq('report_id', reportId)
      .maybeSingle();
      
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingData) {
      // Update existing record
      console.log("Updating existing strategy record");
      const { error } = await supabase
        .from('narrative_strategy')
        .update({
          products_services: formData.productsServices,
          markets: formData.markets,
          business_relations: formData.businessRelations,
          sustainability_strategy: formData.sustainabilityStrategy,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
        
      if (error) throw error;
    } else {
      // Insert new record
      console.log("Creating new strategy record");
      const { error } = await supabase
        .from('narrative_strategy')
        .insert({
          report_id: reportId,
          products_services: formData.productsServices,
          markets: formData.markets,
          business_relations: formData.businessRelations,
          sustainability_strategy: formData.sustainabilityStrategy,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    }
  }, [reportId, formData]);

  // Use the common save feedback hook
  const { saveWithFeedback, isSaving } = useSaveFeedback({
    setLastSaved,
    saveOperation
  });

  return { saveData: saveWithFeedback, isSaving };
};
