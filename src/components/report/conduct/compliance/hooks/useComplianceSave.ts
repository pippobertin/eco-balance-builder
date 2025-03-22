
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/hooks/use-report-context';

export const useComplianceSave = (
  reportId: string,
  formData: ComplianceFormData,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { setNeedsSaving } = useReport();
  const { toast } = useToast();

  const saveData = useCallback(async () => {
    if (!reportId) {
      console.error("Cannot save compliance data: reportId is undefined");
      return;
    }
    
    setIsSaving(true);
    console.log("Saving compliance data for reportId:", reportId);

    try {
      // Verifica se esiste già un record
      const { data: existingData, error: checkError } = await supabase
        .from('compliance_standards')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }

      let result;
      
      if (existingData) {
        // Aggiornamento di un record esistente
        result = await supabase
          .from('compliance_standards')
          .update({
            compliance_standards: formData.complianceStandards,
            compliance_monitoring: formData.complianceMonitoring,
            updated_at: new Date().toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Creazione di un nuovo record
        result = await supabase
          .from('compliance_standards')
          .insert({
            report_id: reportId,
            compliance_standards: formData.complianceStandards,
            compliance_monitoring: formData.complianceMonitoring,
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) {
        throw result.error;
      }

      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati di compliance salvati con successo"
      });
      
      console.log("Compliance data saved successfully");
    } catch (error: any) {
      console.error('Error saving compliance data:', error);
      
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio dei dati di compliance",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setIsSaving, setLastSaved, setNeedsSaving, toast]);

  return { saveData };
};
