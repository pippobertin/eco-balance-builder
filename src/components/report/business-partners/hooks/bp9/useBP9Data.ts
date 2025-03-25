
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP9FormData } from '../types';
import { BP9HookResult } from './types';

export const useBP9Data = (reportId: string): BP9HookResult => {
  const [formData, setFormData] = useState<BP9FormData>({
    hasViolations: false,
    violationsDetails: undefined
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('bp9_violations')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP9 data:", error);
          }
        } else if (data) {
          setFormData({
            hasViolations: data.has_violations,
            violationsDetails: data.violations_details
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP9 data:", error);
        toast.error("Errore nel caricamento dei dati sulle violazioni");
      } finally {
        setIsLoading(false);
        setNeedsSaving(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData, isLoading]);

  // Save data to the database
  const saveData = async (): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsLoading(true);
    
    try {
      const now = new Date();
      
      const { error } = await supabase
        .from('bp9_violations')
        .upsert({
          report_id: reportId,
          has_violations: formData.hasViolations,
          violations_details: formData.violationsDetails,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP9 data:", error);
        toast.error("Errore nel salvataggio dei dati sulle violazioni");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sulle violazioni salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP9 data:", error);
      toast.error("Errore nel salvataggio dei dati sulle violazioni");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
