
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP10FormData } from '../types';
import { BP10HookResult } from './types';

export const useBP10Data = (reportId: string): BP10HookResult => {
  const [formData, setFormData] = useState<BP10FormData>({
    maleFamilyLeaveEligible: undefined,
    femaleFamilyLeaveEligible: undefined,
    maleFamilyLeaveUsed: undefined,
    femaleFamilyLeaveUsed: undefined
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
          .from('bp10_work_life_balance')
          .select('*')
          .eq('report_id', reportId)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP10 data:", error);
          }
        } else if (data) {
          setFormData({
            maleFamilyLeaveEligible: data.male_family_leave_eligible,
            femaleFamilyLeaveEligible: data.female_family_leave_eligible,
            maleFamilyLeaveUsed: data.male_family_leave_used,
            femaleFamilyLeaveUsed: data.female_family_leave_used
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP10 data:", error);
        toast.error("Errore nel caricamento dei dati sull'equilibrio vita-lavoro");
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
        .from('bp10_work_life_balance')
        .upsert({
          report_id: reportId,
          male_family_leave_eligible: formData.maleFamilyLeaveEligible,
          female_family_leave_eligible: formData.femaleFamilyLeaveEligible,
          male_family_leave_used: formData.maleFamilyLeaveUsed,
          female_family_leave_used: formData.femaleFamilyLeaveUsed,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP10 data:", error);
        toast.error("Errore nel salvataggio dei dati sull'equilibrio vita-lavoro");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sull'equilibrio vita-lavoro salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP10 data:", error);
      toast.error("Errore nel salvataggio dei dati sull'equilibrio vita-lavoro");
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
