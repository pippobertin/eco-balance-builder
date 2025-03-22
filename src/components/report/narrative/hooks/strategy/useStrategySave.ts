
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { toast } from 'sonner';
import { useReport } from '@/context/ReportContext';

export const useStrategySave = (reportId: string, formData: StrategyFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { setNeedsSaving } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);

    try {
      // First, check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_strategy')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        console.error('Error checking existing strategy data:', checkError);
        toast.error('Errore durante il controllo dei dati esistenti');
        setIsSaving(false);
        return;
      }
      
      let saveError;
      
      if (existingData) {
        // If record exists, update it
        console.log('Updating existing strategy record for report:', reportId);
        const { error } = await supabase
          .from('narrative_strategy')
          .update({
            products_services: formData.productsServices,
            markets: formData.markets,
            business_relations: formData.businessRelations,
            sustainability_strategy: formData.sustainabilityStrategy,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
        
        saveError = error;
      } else {
        // If no record exists, create a new one
        console.log('Creating new strategy record for report:', reportId);
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
        
        saveError = error;
      }
      
      if (saveError) {
        console.error('Error saving strategy data:', saveError);
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
