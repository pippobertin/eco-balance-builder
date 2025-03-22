
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ComplianceFormData } from './types';

export const useComplianceSave = (
  reportId: string,
  formData: ComplianceFormData,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { toast } = useToast();

  const saveData = useCallback(async (customData?: ComplianceFormData) => {
    if (!reportId) {
      console.error("Cannot save: Report ID is missing");
      toast({
        title: "Errore",
        description: "Impossibile salvare: ID report mancante",
        variant: "destructive"
      });
      return false;
    }

    const dataToSave = customData || formData;
    
    console.log("Saving compliance data:", dataToSave);
    setIsSaving(true);

    try {
      // First check if a record exists
      const { data: existingData, error: checkError } = await supabase
        .from('compliance_standards')
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
        const { data, error } = await supabase
          .from('compliance_standards')
          .update({
            compliance_standards: dataToSave.complianceStandards,
            compliance_monitoring: dataToSave.complianceMonitoring,
            updated_at: now
          })
          .eq('report_id', reportId)
          .select();

        if (error) throw error;
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('compliance_standards')
          .insert({
            report_id: reportId,
            compliance_standards: dataToSave.complianceStandards,
            compliance_monitoring: dataToSave.complianceMonitoring,
            updated_at: now
          })
          .select();

        if (error) throw error;
        result = data;
      }

      console.log("Compliance data saved successfully:", result);
      setLastSaved(new Date(now));
      
      toast({
        title: "Salvato con successo",
        description: "I dati di compliance sono stati salvati"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving compliance data:", error);
      
      toast({
        title: "Errore di salvataggio",
        description: error.message || "Si è verificato un errore durante il salvataggio dei dati",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setIsSaving, setLastSaved, toast]);

  return { saveData };
};
