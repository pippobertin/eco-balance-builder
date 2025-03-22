
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyFormData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useStrategySave = (reportId: string, formData: StrategyFormData) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { setNeedsSaving, setLastSaved } = useReport();

  const saveData = async () => {
    if (!reportId) return;
    
    setIsSaving(true);
    
    try {
      // Transform form data to API format
      const apiData = {
        report_id: reportId,
        products_services: formData.productsServices || null,
        markets: formData.markets || null,
        business_relations: formData.businessRelations || null,
        sustainability_strategy: formData.sustainabilityStrategy || null
      };
      
      // Check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('narrative_strategy')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('narrative_strategy')
          .update(apiData)
          .eq('id', existingData.id);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('narrative_strategy')
          .insert([apiData]);
          
        if (insertError) {
          throw insertError;
        }
      }
      
      // Successfully saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Salvato",
        description: "I dati della strategia sono stati salvati con successo."
      });
      
    } catch (error: any) {
      console.error('Error saving strategy data:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare i dati della strategia: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    saveData,
    isSaving
  };
};
