
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP8FormData } from '../types';
import { BP8HookResult } from './types';

export const useBP8Data = (reportId: string): BP8HookResult => {
  const [formData, setFormData] = useState<BP8FormData>({
    hasComplianceProcesses: false,
    complianceProcessesDetails: undefined
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
          .from('bp8_compliance_processes')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP8 data:", error);
          }
        } else if (data) {
          setFormData({
            hasComplianceProcesses: data.has_compliance_processes,
            complianceProcessesDetails: data.compliance_processes_details
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP8 data:", error);
        toast.error("Errore nel caricamento dei dati sui processi di conformità");
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
        .from('bp8_compliance_processes')
        .upsert({
          report_id: reportId,
          has_compliance_processes: formData.hasComplianceProcesses,
          compliance_processes_details: formData.complianceProcessesDetails,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP8 data:", error);
        toast.error("Errore nel salvataggio dei dati sui processi di conformità");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui processi di conformità salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP8 data:", error);
      toast.error("Errore nel salvataggio dei dati sui processi di conformità");
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
