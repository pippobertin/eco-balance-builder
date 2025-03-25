
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP7FormData } from '../types';
import { BP7HookResult } from './types';

export const useBP7Data = (reportId: string): BP7HookResult => {
  const [formData, setFormData] = useState<BP7FormData>({
    hasPoliciesAligned: false,
    alignedInstruments: undefined
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
          .from('bp7_policy_alignment')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP7 data:", error);
          }
        } else if (data) {
          setFormData({
            hasPoliciesAligned: data.has_policies_aligned,
            alignedInstruments: data.aligned_instruments
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP7 data:", error);
        toast.error("Errore nel caricamento dei dati sull'allineamento delle politiche");
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
        .from('bp7_policy_alignment')
        .upsert({
          report_id: reportId,
          has_policies_aligned: formData.hasPoliciesAligned,
          aligned_instruments: formData.alignedInstruments,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP7 data:", error);
        toast.error("Errore nel salvataggio dei dati sull'allineamento delle politiche");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sull'allineamento delle politiche salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP7 data:", error);
      toast.error("Errore nel salvataggio dei dati sull'allineamento delle politiche");
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
