
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';
import { AntiCorruptionData } from './types';

export const useAntiCorruptionSave = (
  reportId: string | undefined, 
  setAntiCorruptionData: React.Dispatch<React.SetStateAction<AntiCorruptionData | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Save anti-corruption data
  const saveAntiCorruptionData = useCallback(async (values: Partial<AntiCorruptionData>) => {
    if (!reportId) {
      console.error("Cannot save anti-corruption data: reportId is undefined");
      return false;
    }
    
    if (!values) {
      console.error("Cannot save anti-corruption data: values is undefined");
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving anti-corruption data for report:", reportId, values);
      
      // Convert values to numbers before saving, ensuring we have valid numbers or null
      const convictionsNumber = values.convictionsNumber !== undefined && values.convictionsNumber !== null 
        ? Number(values.convictionsNumber) 
        : null;
        
      const sanctionsAmount = values.sanctionsAmount !== undefined && values.sanctionsAmount !== null 
        ? Number(values.sanctionsAmount) 
        : null;
      
      const dataPayload = {
        report_id: reportId,
        convictions_number: convictionsNumber,
        sanctions_amount: sanctionsAmount,
        additional_details: values.additionalDetails || null,
        updated_at: new Date().toISOString()
      };
      
      console.log("Data payload being sent to Supabase:", dataPayload);
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('anti_corruption_metrics')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }
      
      // If data exists, update it
      if (existingData) {
        console.log("Updating existing anti-corruption record with ID:", existingData.id);
        
        const { data, error } = await supabase
          .from('anti_corruption_metrics')
          .update(dataPayload)
          .eq('report_id', reportId)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new anti-corruption record");
        
        const { data, error } = await supabase
          .from('anti_corruption_metrics')
          .insert(dataPayload)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Anti-corruption data saved successfully:", result);
      
      // Update local state with the new values
      const updatedData: AntiCorruptionData = {
        convictionsNumber: convictionsNumber,
        sanctionsAmount: sanctionsAmount,
        additionalDetails: values.additionalDetails || null
      };
      
      setAntiCorruptionData(updatedData);
      
      // Mark as saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati anticorruzione salvati con successo"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving anti-corruption data:", error);
      handleSupabaseError(error, "Errore durante il salvataggio dei dati anticorruzione");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [reportId, setAntiCorruptionData, toast, setNeedsSaving]);

  return {
    isSaving,
    lastSaved,
    saveAntiCorruptionData
  };
};
