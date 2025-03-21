
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';

export const useWorkforceData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [workforceData, setWorkforceData] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Load workforce data
  const loadWorkforceData = async () => {
    if (!reportId) {
      console.log("Cannot load workforce data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading workforce data for report:", reportId);
      
      const { data, error } = await supabase
        .from('workforce_distribution')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Workforce data loaded:", data);
      
      if (data) {
        setWorkforceData(data);
        setLastSaved(new Date(data.updated_at));
        return data;
      }
      
    } catch (error: any) {
      console.error("Error loading workforce data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati della forza lavoro");
    } finally {
      setLoading(false);
    }
    
    return null;
  };

  // Save workforce data
  const saveWorkforceData = async (values: any) => {
    if (!reportId || !values) {
      console.error("Cannot save workforce data: reportId or values is undefined", { reportId, values });
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving workforce data for report:", reportId, values);
      
      const workforcePayload = {
        report_id: reportId,
        total_employees: values.totalEmployees || 0,
        total_employees_fte: values.totalEmployeesFTE || 0,
        permanent_employees: values.permanentEmployees || 0,
        temporary_employees: values.temporaryEmployees || 0,
        male_employees: values.maleEmployees || 0,
        female_employees: values.femaleEmployees || 0,
        other_gender_employees: values.otherGenderEmployees || 0,
        distribution_notes: values.employeesByCountry || '',
        updated_at: new Date().toISOString()
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('workforce_distribution')
        .select('id')
        .eq('report_id', reportId)
        .single();
      
      let result;
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found error code
        throw checkError;
      }
      
      // If data exists, update it
      if (existingData) {
        console.log("Updating existing workforce record with ID:", existingData.id);
        
        const { data, error } = await supabase
          .from('workforce_distribution')
          .update(workforcePayload)
          .eq('report_id', reportId);
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new workforce record");
        
        const { data, error } = await supabase
          .from('workforce_distribution')
          .insert(workforcePayload);
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Workforce data saved successfully:", result);
      
      // Reload workforce data
      await loadWorkforceData();
      
      // Mark as saved
      setNeedsSaving(false);
      setLastSaved(new Date());
      
      toast({
        title: "Successo",
        description: "Dati della forza lavoro salvati con successo"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error saving workforce data:", error);
      handleSupabaseError(error, "Errore durante il salvataggio dei dati della forza lavoro");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (reportId) {
      loadWorkforceData();
    }
  }, [reportId]);

  return {
    loading,
    workforceData,
    loadWorkforceData,
    saveWorkforceData,
    isSaving,
    lastSaved
  };
};
