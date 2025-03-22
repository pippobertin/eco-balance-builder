
import { useCallback } from 'react';
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
      toast({
        title: "Errore",
        description: "ID Report mancante, impossibile salvare",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    console.log("Saving compliance data for reportId:", reportId, formData);

    try {
      // Verifica se esiste già un record
      const { data: existingData, error: checkError } = await supabase
        .from('compliance_standards')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        console.error("Error checking existing compliance data:", checkError);
        throw checkError;
      }

      let result;
      const timestamp = new Date().toISOString();
      
      if (existingData) {
        // Aggiornamento di un record esistente
        console.log("Updating existing compliance record with ID:", existingData.id);
        result = await supabase
          .from('compliance_standards')
          .update({
            compliance_standards: formData.complianceStandards,
            compliance_monitoring: formData.complianceMonitoring,
            updated_at: timestamp
          })
          .eq('report_id', reportId);
      } else {
        // Creazione di un nuovo record
        console.log("Creating new compliance record for reportId:", reportId);
        result = await supabase
          .from('compliance_standards')
          .insert({
            report_id: reportId,
            compliance_standards: formData.complianceStandards,
            compliance_monitoring: formData.complianceMonitoring,
            updated_at: timestamp
          });
      }

      if (result.error) {
        console.error("Error saving compliance data:", result.error);
        throw result.error;
      }

      console.log("Compliance data saved successfully");
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati di compliance salvati con successo"
      });
    } catch (error: any) {
      console.error('Error saving compliance data:', error);
      
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio dei dati di compliance: " + (error.message || error),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setIsSaving, setLastSaved, setNeedsSaving, toast]);

  return { saveData };
};
