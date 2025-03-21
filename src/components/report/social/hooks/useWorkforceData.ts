
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';

export interface WorkforceData {
  totalEmployees: number | null;
  totalEmployeesFTE: number | null;
  permanentEmployees: number | null;
  temporaryEmployees: number | null;
  maleEmployees: number | null;
  femaleEmployees: number | null;
  otherGenderEmployees: number | null;
  employeesByCountry: string | null;
}

export const useWorkforceData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [workforceData, setWorkforceData] = useState<WorkforceData | null>(null);
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
        const formattedData: WorkforceData = {
          totalEmployees: data.total_employees,
          totalEmployeesFTE: data.total_employees_fte,
          permanentEmployees: data.permanent_employees,
          temporaryEmployees: data.temporary_employees,
          maleEmployees: data.male_employees,
          femaleEmployees: data.female_employees,
          otherGenderEmployees: data.other_gender_employees,
          employeesByCountry: data.distribution_notes
        };
        
        setWorkforceData(formattedData);
        setLastSaved(new Date(data.updated_at));
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading workforce data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati della forza lavoro");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save workforce data
  const saveWorkforceData = async (values: Partial<WorkforceData>) => {
    if (!reportId) {
      console.error("Cannot save workforce data: reportId is undefined");
      return false;
    }
    
    if (!values) {
      console.error("Cannot save workforce data: values is undefined");
      return false;
    }
    
    try {
      setIsSaving(true);
      setNeedsSaving(true);
      
      console.log("Saving workforce data for report:", reportId, values);
      
      const workforcePayload = {
        report_id: reportId,
        total_employees: values.totalEmployees !== undefined ? values.totalEmployees : 0,
        total_employees_fte: values.totalEmployeesFTE !== undefined ? values.totalEmployeesFTE : 0,
        permanent_employees: values.permanentEmployees !== undefined ? values.permanentEmployees : 0,
        temporary_employees: values.temporaryEmployees !== undefined ? values.temporaryEmployees : 0,
        male_employees: values.maleEmployees !== undefined ? values.maleEmployees : 0,
        female_employees: values.femaleEmployees !== undefined ? values.femaleEmployees : 0,
        other_gender_employees: values.otherGenderEmployees !== undefined ? values.otherGenderEmployees : 0,
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
          .eq('report_id', reportId)
          .select();
        
        if (error) throw error;
        result = data;
      } else {
        // If no data exists, create a new record
        console.log("Creating new workforce record");
        
        const { data, error } = await supabase
          .from('workforce_distribution')
          .insert(workforcePayload)
          .select();
        
        if (error) throw error;
        result = data;
      }
      
      console.log("Workforce data saved successfully:", result);
      
      // Update local state with the new values
      setWorkforceData(prev => ({
        ...prev,
        ...values
      }));
      
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
      console.log("Loading workforce data on mount for report:", reportId);
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
