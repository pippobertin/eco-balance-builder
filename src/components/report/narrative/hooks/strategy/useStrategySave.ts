
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useStrategySave = (
  reportId: string, 
  formData: StrategyFormData, 
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      console.log('Saving strategy data for report:', reportId);
      
      // First, check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_strategy')
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
          .from('narrative_strategy')
          .update({
            products_services: formData.productsServices,
            markets: formData.markets,
            business_relations: formData.businessRelations,
            sustainability_strategy: formData.sustainabilityStrategy,
            updated_at: now
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('narrative_strategy')
          .insert({
            report_id: reportId,
            products_services: formData.productsServices,
            markets: formData.markets,
            business_relations: formData.businessRelations,
            sustainability_strategy: formData.sustainabilityStrategy,
            updated_at: now
          });
      }
      
      if (result.error) {
        throw result.error;
      }

      const newSavedTime = new Date();
      setLastSaved(newSavedTime);
      setNeedsSaving(false);
      toast.success('Dati salvati con successo');
    } catch (error: any) {
      console.error('Error in save operation:', error);
      toast.error(`Errore durante il salvataggio: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveData, isSaving };
};
