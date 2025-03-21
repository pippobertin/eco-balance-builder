
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';
import { WorkforceSafetyData } from './types';

export const useWorkforceSafetySave = (
  reportId: string | undefined, 
  setSafetyData: React.Dispatch<React.SetStateAction<WorkforceSafetyData | null>>
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Save workforce safety data
  const saveSafetyData = useCallback(async (values: Partial<WorkforceSafetyData>) => {
    if (!reportId) {
      console.error("Cannot save safety data: reportId is undefined");
      return false;
    }
    
    if (!values) {
      console.error("Cannot save safety data: values is undefined");
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving workforce safety data for report:", reportId, values);
      
      const safetyPayload = {
        report_id: reportId,
        total_hours_worked: values.totalHoursWorked !== undefined ? values.totalHoursWorked : null,
        work_accidents_number: values.workAccidentsNumber !== undefined ? values.workAccidentsNumber : null,
        work_accidents_rate: values.workAccidentsRate !== undefined ? values.workAccidentsRate : null,
        work_accident_deaths: values.workAccidentDeaths !== undefined ? values.workAccidentDeaths : null,
        work_disease_deaths: values.workDiseaseDeaths !== undefined ? values.workDiseaseDeaths : null,
        updated_at: new Date().toISOString()
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('workforce_safety')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }
      
      // If data exists, update it
      if (existingData) {
        console.log("Updating existing safety record with ID:", existingData.id);
        
        const { data, error } = await supabase
          .from('workforce_safety')
          .update(safetyPayload)
          .eq('report_id', reportId)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new safety record");
        
        const { data, error } = await supabase
          .from('workforce_safety')
          .insert(safetyPayload)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Workforce safety data saved successfully:", result);
      
      // Update local state with the new values
      setSafetyData(prev => ({
        ...prev,
        ...values
      }));
      
      // Mark as saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati di sicurezza salvati con successo"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving workforce safety data:", error);
      handleSupabaseError(error, "Errore durante il salvataggio dei dati di sicurezza");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [reportId, setSafetyData, toast, setNeedsSaving]);

  return {
    isSaving,
    lastSaved,
    saveSafetyData
  };
};
