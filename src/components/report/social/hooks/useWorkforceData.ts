
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';

export const useWorkforceData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [workforceData, setWorkforceData] = useState<any>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load workforce data
  const loadWorkforceData = async () => {
    if (!reportId) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('workforce_distribution')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
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
    if (!reportId || !values) return false;
    
    try {
      setIsSaving(true);
      
      console.log("Saving workforce data:", { reportId, values });
      
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
      
      // Save to the workforce_distribution table
      const { error } = await supabase
        .from('workforce_distribution')
        .upsert(workforcePayload, { onConflict: 'report_id' });
      
      if (error) throw error;
      
      // Reload workforce data
      await loadWorkforceData();
      
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
