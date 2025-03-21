
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';

export interface AntiCorruptionData {
  convictionsNumber: number | null;
  sanctionsAmount: number | null;
  additionalDetails: string | null;
}

export const useAntiCorruptionData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [antiCorruptionData, setAntiCorruptionData] = useState<AntiCorruptionData | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Load anti-corruption data
  const loadAntiCorruptionData = async () => {
    if (!reportId) {
      console.log("Cannot load anti-corruption data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading anti-corruption data for report:", reportId);
      
      const { data, error } = await supabase
        .from('anti_corruption_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Anti-corruption data loaded:", data);
      
      if (data) {
        const formattedData: AntiCorruptionData = {
          convictionsNumber: data.convictions_number,
          sanctionsAmount: data.sanctions_amount,
          additionalDetails: data.additional_details
        };
        
        setAntiCorruptionData(formattedData);
        setLastSaved(new Date(data.updated_at));
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading anti-corruption data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati anticorruzione");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save anti-corruption data
  const saveAntiCorruptionData = async (values: Partial<AntiCorruptionData>) => {
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
      
      const dataPayload = {
        report_id: reportId,
        convictions_number: values.convictionsNumber,
        sanctions_amount: values.sanctionsAmount,
        additional_details: values.additionalDetails,
        updated_at: new Date().toISOString()
      };
      
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
      setAntiCorruptionData(prev => ({
        ...prev,
        ...values
      }));
      
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
  };

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading anti-corruption data on mount for report:", reportId);
      loadAntiCorruptionData();
    }
  }, [reportId]);

  return {
    loading,
    antiCorruptionData,
    loadAntiCorruptionData,
    saveAntiCorruptionData,
    isSaving,
    lastSaved
  };
};
