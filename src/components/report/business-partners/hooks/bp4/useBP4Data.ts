
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP4FormData } from '../types';
import { BP4HookResult } from './types';

export const useBP4Data = (reportId: string): BP4HookResult => {
  const [formData, setFormData] = useState<BP4FormData>({
    hasTransitionPlan: false,
    transitionPlanDetails: undefined
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
          .from('bp4_transition_plan')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP4 data:", error);
          }
        } else if (data) {
          setFormData({
            hasTransitionPlan: data.has_transition_plan,
            transitionPlanDetails: data.transition_plan_details
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP4 data:", error);
        toast.error("Errore nel caricamento dei dati sul piano di transizione");
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
        .from('bp4_transition_plan')
        .upsert({
          report_id: reportId,
          has_transition_plan: formData.hasTransitionPlan,
          transition_plan_details: formData.transitionPlanDetails,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP4 data:", error);
        toast.error("Errore nel salvataggio dei dati sul piano di transizione");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sul piano di transizione salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP4 data:", error);
      toast.error("Errore nel salvataggio dei dati sul piano di transizione");
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
