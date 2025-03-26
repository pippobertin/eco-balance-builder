
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP10FormData } from '../types';
import { BP10HookResult } from './types';

export const useBP10Data = (reportId: string): BP10HookResult => {
  const [formData, setFormData] = useState<BP10FormData>({
    maleParentalLeaveEligible: undefined,
    femaleParentalLeaveEligible: undefined,
    maleParentalLeaveUsed: undefined,
    femaleParentalLeaveUsed: undefined
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
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP10 data:", error);
          }
        } else if (data) {
          setFormData({
            maleParentalLeaveEligible: data.male_family_leave_eligible,
            femaleParentalLeaveEligible: data.female_family_leave_eligible,
            maleParentalLeaveUsed: data.male_family_leave_used,
            femaleParentalLeaveUsed: data.female_family_leave_used
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
      
      // Check if record exists
      const { data: existingRecord } = await supabase
        .from('bp10_work_life_balance')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('bp10_work_life_balance')
          .update({
            male_family_leave_eligible: formData.maleParentalLeaveEligible,
            female_family_leave_eligible: formData.femaleParentalLeaveEligible,
            male_family_leave_used: formData.maleParentalLeaveUsed,
            female_family_leave_used: formData.femaleParentalLeaveUsed,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp10_work_life_balance')
          .insert({
            report_id: reportId,
            male_family_leave_eligible: formData.maleParentalLeaveEligible,
            female_family_leave_eligible: formData.femaleParentalLeaveEligible,
            male_family_leave_used: formData.maleParentalLeaveUsed,
            female_family_leave_used: formData.femaleParentalLeaveUsed,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP10 data:", result.error);
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
