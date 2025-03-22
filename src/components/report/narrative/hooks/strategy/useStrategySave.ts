
import { useCallback, useState } from 'react';
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

  const saveData = useCallback(async () => {
    if (!reportId) return;

    setIsSaving(true);

    try {
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
      
      let result;
      
      if (existingData) {
        // Update existing record
        console.log("Updating existing strategy record");
        const { data, error } = await supabase
          .from('narrative_strategy')
          .update({
            products_services: formData.productsServices,
            markets: formData.markets,
            business_relations: formData.businessRelations,
            sustainability_strategy: formData.sustainabilityStrategy,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        console.log("Creating new strategy record");
        const { data, error } = await supabase
          .from('narrative_strategy')
          .insert({
            report_id: reportId,
            products_services: formData.productsServices,
            markets: formData.markets,
            business_relations: formData.businessRelations,
            sustainability_strategy: formData.sustainabilityStrategy,
            updated_at: new Date().toISOString()
          })
          .select();
          
        if (error) throw error;
        result = data;
      }

      setNeedsSaving(false);
      setLastSaved(new Date());
      toast.success('Dati salvati con successo');
    } catch (error: any) {
      console.error('Error saving strategy data:', error);
      toast.error(`Errore durante il salvataggio: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setLastSaved, setNeedsSaving]);

  return { saveData, isSaving };
};
