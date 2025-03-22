
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFormData } from './types';
import { toast } from 'sonner';
import { useReport } from '@/hooks/use-report-context';
import { useCallback } from 'react';

export const useComplianceSave = (
  reportId: string, 
  formData: ComplianceFormData,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const { setNeedsSaving } = useReport();

  const saveData = useCallback(async () => {
    if (!reportId) return;
    
    setIsSaving(true);
    console.log("Saving compliance data for reportId:", reportId);

    try {
      const { error } = await supabase
        .from('compliance_standards')
        .upsert({
          report_id: reportId,
          compliance_standards: formData.complianceStandards,
          compliance_monitoring: formData.complianceMonitoring,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving compliance data:', error);
        toast.error('Errore durante il salvataggio');
        return;
      }

      setNeedsSaving(false);
      setLastSaved(new Date());
      toast.success('Dati salvati con successo');
      console.log("Compliance data saved successfully");
    } catch (error) {
      console.error('Error in save operation:', error);
      toast.error('Errore durante il salvataggio');
    } finally {
      setIsSaving(false);
    }
  }, [reportId, formData, setIsSaving, setLastSaved, setNeedsSaving]);

  return { saveData };
};
