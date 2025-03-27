
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP6FormData } from '../types';
import { BP6HookResult } from './types';

export const useBP6Data = (reportId: string): BP6HookResult => {
  const [formData, setFormData] = useState<BP6FormData>({
    hasHazardousWaste: false,
    hazardousWasteTotal: undefined,
    radioactiveWasteTotal: undefined
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('bp6_hazardous_waste')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP6 data:", error);
          }
        } else if (data) {
          setFormData({
            hasHazardousWaste: data.has_hazardous_waste,
            hazardousWasteTotal: data.hazardous_waste_total,
            radioactiveWasteTotal: data.radioactive_waste_total
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP6 data:", error);
        toast.error("Errore nel caricamento dei dati sui rifiuti pericolosi");
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (!isLoading && !isSaving) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading, isSaving]);

  // Save data to the database
  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    
    try {
      const now = new Date();
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('bp6_hazardous_waste')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) {
        console.error("Error checking for existing BP6 record:", checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('bp6_hazardous_waste')
          .update({
            has_hazardous_waste: formData.hasHazardousWaste,
            hazardous_waste_total: formData.hazardousWasteTotal,
            radioactive_waste_total: formData.radioactiveWasteTotal,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp6_hazardous_waste')
          .insert({
            report_id: reportId,
            has_hazardous_waste: formData.hasHazardousWaste,
            hazardous_waste_total: formData.hazardousWasteTotal,
            radioactive_waste_total: formData.radioactiveWasteTotal,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP6 data:", result.error);
        toast.error("Errore nel salvataggio dei dati sui rifiuti pericolosi");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui rifiuti pericolosi salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP6 data:", error);
      toast.error("Errore nel salvataggio dei dati sui rifiuti pericolosi");
      return false;
    } finally {
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
    needsSaving
  };
};
