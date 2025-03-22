
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFormData } from './types';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

export const useComplianceSave = (reportId: string, formData: ComplianceFormData) => {
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
        compliance_standards: formData.complianceStandards || null,
        compliance_monitoring: formData.complianceMonitoring || null
      };
      
      // Check if a record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('compliance_standards')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
        
      if (checkError) {
        throw checkError;
      }
      
      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('compliance_standards')
          .update(apiData)
          .eq('id', existingData.id);
          
        if (updateError) {
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('compliance_standards')
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
        description: "I dati di conformità sono stati salvati con successo."
      });
      
    } catch (error: any) {
      console.error('Error saving compliance data:', error.message);
      toast({
        title: "Errore",
        description: `Impossibile salvare i dati di conformità: ${error.message}`,
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
