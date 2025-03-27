
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP11FormData } from '../types';
import { BP11HookResult } from './types';
import { handleSupabaseError } from '@/integrations/supabase/utils/errorUtils';

export const useBP11Data = (reportId: string): BP11HookResult => {
  const [formData, setFormData] = useState<BP11FormData>({
    hasApprentices: false,
    apprenticesNumber: undefined,
    apprenticesPercentage: undefined
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch total employees first from workforce_distribution table
        const { data: workforceData, error: workforceError } = await supabase
          .from('workforce_distribution')
          .select('total_employees')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (workforceError) {
          if (workforceError.code !== 'PGRST116') {
            console.error("Error fetching workforce data:", workforceError);
            handleSupabaseError(workforceError, "Errore nel caricamento dei dati sui dipendenti");
          }
        } else if (workforceData && workforceData.total_employees) {
          setTotalEmployees(workforceData.total_employees);
        }
        
        // Fetch BP11 data
        const { data, error } = await supabase
          .from('bp11_apprentices')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP11 data:", error);
            handleSupabaseError(error, "Errore nel caricamento dei dati sugli apprendisti");
          }
        } else if (data) {
          setFormData({
            hasApprentices: data.has_apprentices,
            apprenticesNumber: data.apprentices_number,
            apprenticesPercentage: data.apprentices_percentage
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP11 data:", error);
        toast.error("Errore nel caricamento dei dati sugli apprendisti");
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Update percentage automatically when apprentices number or total employees changes
  useEffect(() => {
    if (formData.hasApprentices && formData.apprenticesNumber !== undefined && totalEmployees && totalEmployees > 0) {
      const calculatedPercentage = (formData.apprenticesNumber / totalEmployees) * 100;
      
      // Only update if the calculated percentage is different from the current one
      if (formData.apprenticesPercentage !== calculatedPercentage) {
        setFormData(prev => ({
          ...prev,
          apprenticesPercentage: parseFloat(calculatedPercentage.toFixed(2))
        }));
      }
    }
  }, [formData.apprenticesNumber, totalEmployees, formData.hasApprentices]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (!isLoading && !isSaving) {
      setNeedsSaving(true);
    }
  }, [formData.hasApprentices, formData.apprenticesNumber, isLoading, isSaving]);

  // Save data to the database
  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    setIsSaving(true);
    
    try {
      const now = new Date();
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp11_apprentices')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) {
        console.error("Error checking for existing BP11 record:", checkError);
        handleSupabaseError(checkError, "Errore nel controllo dei dati esistenti sugli apprendisti");
        return false;
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('bp11_apprentices')
          .update({
            has_apprentices: formData.hasApprentices,
            apprentices_number: formData.apprenticesNumber,
            apprentices_percentage: formData.apprenticesPercentage,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp11_apprentices')
          .insert({
            report_id: reportId,
            has_apprentices: formData.hasApprentices,
            apprentices_number: formData.apprenticesNumber,
            apprentices_percentage: formData.apprenticesPercentage,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP11 data:", result.error);
        handleSupabaseError(result.error, "Errore nel salvataggio dei dati sugli apprendisti");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sugli apprendisti salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP11 data:", error);
      toast.error("Errore nel salvataggio dei dati sugli apprendisti");
      return false;
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    saveData,
    lastSaved,
    needsSaving,
    totalEmployees
  };
};
