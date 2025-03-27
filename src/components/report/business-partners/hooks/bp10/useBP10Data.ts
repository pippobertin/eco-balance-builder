
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
          .from('bp10_family_leave')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
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
        toast.error("Errore nel caricamento dei dati sui congedi familiari");
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
        .from('bp10_family_leave')
        .select('id')
        .eq('report_id', reportId);
        
      if (checkError) {
        console.error("Error checking for existing BP10 record:", checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('bp10_family_leave')
          .update({
            male_family_leave_eligible: formData.maleFamilyLeaveEligible,
            female_family_leave_eligible: formData.femaleFamilyLeaveEligible,
            male_family_leave_used: formData.maleFamilyLeaveUsed,
            female_family_leave_used: formData.femaleFamilyLeaveUsed,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp10_family_leave')
          .insert({
            report_id: reportId,
            male_family_leave_eligible: formData.maleFamilyLeaveEligible,
            female_family_leave_eligible: formData.femaleFamilyLeaveEligible,
            male_family_leave_used: formData.maleFamilyLeaveUsed,
            female_family_leave_used: formData.femaleFamilyLeaveUsed,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP10 data:", result.error);
        toast.error("Errore nel salvataggio dei dati sui congedi familiari");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sui congedi familiari salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP10 data:", error);
      toast.error("Errore nel salvataggio dei dati sui congedi familiari");
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
