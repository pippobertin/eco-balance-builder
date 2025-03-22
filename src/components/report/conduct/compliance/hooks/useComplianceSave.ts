
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';
import { ComplianceData } from './types';

export const useComplianceSave = (
  reportId: string | undefined, 
  setComplianceData: React.Dispatch<React.SetStateAction<ComplianceData | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Save compliance data
  const saveComplianceData = useCallback(async (values: Partial<ComplianceData>) => {
    if (!reportId) {
      console.error("Cannot save compliance data: reportId is undefined");
      return false;
    }
    
    if (!values) {
      console.error("Cannot save compliance data: values is undefined");
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving compliance data for report:", reportId, values);
      
      const dataPayload = {
        report_id: reportId,
        compliance_standards: values.complianceStandards || null,
        compliance_monitoring: values.complianceMonitoring || null,
        updated_at: new Date().toISOString()
      };
      
      console.log("Data payload being sent to Supabase:", dataPayload);
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('compliance_standards')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }
      
      // If data exists, update it
      if (existingData) {
        console.log("Updating existing compliance record with ID:", existingData.id);
        
        const { data, error } = await supabase
          .from('compliance_standards')
          .update(dataPayload)
          .eq('report_id', reportId)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new compliance record");
        
        const { data, error } = await supabase
          .from('compliance_standards')
          .insert(dataPayload)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Compliance data saved successfully:", result);
      
      // Update local state with the new values
      const updatedData: ComplianceData = {
        complianceStandards: values.complianceStandards || null,
        complianceMonitoring: values.complianceMonitoring || null
      };
      
      setComplianceData(updatedData);
      
      // Mark as saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati di compliance salvati con successo"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving compliance data:", error);
      handleSupabaseError(error, "Errore durante il salvataggio dei dati di compliance");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [reportId, setComplianceData, toast, setNeedsSaving]);

  return {
    isSaving,
    lastSaved,
    saveComplianceData
  };
};
