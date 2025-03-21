
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';
import { SupplyChainData } from './types';

export const useSupplyChainSave = (
  reportId: string | undefined, 
  setSupplyChainData: React.Dispatch<React.SetStateAction<SupplyChainData | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Save supply chain data
  const saveSupplyChainData = useCallback(async (values: Partial<SupplyChainData>) => {
    if (!reportId) {
      console.error("Cannot save supply chain data: reportId is undefined");
      return false;
    }
    
    if (!values) {
      console.error("Cannot save supply chain data: values is undefined");
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving supply chain data for report:", reportId, values);
      
      const supplyChainPayload = {
        report_id: reportId,
        impact_process_description: values.impactProcessDescription !== undefined ? values.impactProcessDescription : null,
        identified_impacts: values.identifiedImpacts !== undefined ? values.identifiedImpacts : null,
        updated_at: new Date().toISOString()
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('supply_chain_metrics')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }
      
      // If data exists, update it
      if (existingData) {
        console.log("Updating existing supply chain record with ID:", existingData.id);
        
        const { data, error } = await supabase
          .from('supply_chain_metrics')
          .update(supplyChainPayload)
          .eq('report_id', reportId)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new supply chain record");
        
        const { data, error } = await supabase
          .from('supply_chain_metrics')
          .insert(supplyChainPayload)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Supply chain data saved successfully:", result);
      
      // Update local state with the new values
      setSupplyChainData(prev => ({
        ...prev,
        ...values
      }));
      
      // Mark as saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati della catena del valore salvati con successo"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving supply chain data:", error);
      handleSupabaseError(error, "Errore durante il salvataggio dei dati della catena del valore");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [reportId, setSupplyChainData, toast, setNeedsSaving]);

  return {
    isSaving,
    lastSaved,
    saveSupplyChainData
  };
};
