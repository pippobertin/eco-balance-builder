
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { useReport } from '@/hooks/use-report-context';

export interface WorkforceSafetyData {
  totalHoursWorked: number | null;
  workAccidentsNumber: number | null;
  workAccidentsRate: number | null;
  workAccidentDeaths: number | null;
  workDiseaseDeaths: number | null;
}

export const useWorkforceSafetyData = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [safetyData, setSafetyData] = useState<WorkforceSafetyData | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { setNeedsSaving } = useReport();

  // Load workforce safety data
  const loadSafetyData = async () => {
    if (!reportId) {
      console.log("Cannot load safety data: reportId is undefined");
      return null;
    }
    
    try {
      setLoading(true);
      console.log("Loading workforce safety data for report:", reportId);
      
      const { data, error } = await supabase
        .from('workforce_safety')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();
      
      if (error) throw error;
      
      console.log("Workforce safety data loaded:", data);
      
      if (data) {
        const formattedData: WorkforceSafetyData = {
          totalHoursWorked: data.total_hours_worked,
          workAccidentsNumber: data.work_accidents_number,
          workAccidentsRate: data.work_accidents_rate,
          workAccidentDeaths: data.work_accident_deaths,
          workDiseaseDeaths: data.work_disease_deaths
        };
        
        setSafetyData(formattedData);
        setLastSaved(new Date(data.updated_at));
        return formattedData;
      }
      
      return null;
    } catch (error: any) {
      console.error("Error loading safety data:", error);
      handleSupabaseError(error, "Impossibile caricare i dati di sicurezza");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save workforce safety data
  const saveSafetyData = async (values: Partial<WorkforceSafetyData>) => {
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
  };

  // Calculate the work accidents rate based on the number of accidents and hours worked
  const calculateAccidentsRate = (accidents: number | null | undefined, hours: number | null | undefined): number | null => {
    if (
      accidents === null || 
      accidents === undefined || 
      hours === null || 
      hours === undefined || 
      hours === 0
    ) {
      return null;
    }
    
    // Updated Formula: (Number of accidents / Total hours worked) x 172,000
    return (accidents / hours) * 172000;
  };

  // Initial data load
  useEffect(() => {
    if (reportId) {
      console.log("Loading workforce safety data on mount for report:", reportId);
      loadSafetyData();
    }
  }, [reportId]);

  return {
    loading,
    safetyData,
    loadSafetyData,
    saveSafetyData,
    calculateAccidentsRate,
    isSaving,
    lastSaved
  };
};
