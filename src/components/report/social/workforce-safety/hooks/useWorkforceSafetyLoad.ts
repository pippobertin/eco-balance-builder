
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';
import { WorkforceSafetyData } from './types';

export const useWorkforceSafetyLoad = (reportId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [safetyData, setSafetyData] = useState<WorkforceSafetyData | null>(null);

  // Load workforce safety data
  const loadSafetyData = useCallback(async () => {
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
  }, [reportId]);

  return {
    loading,
    safetyData,
    setSafetyData,
    loadSafetyData
  };
};
