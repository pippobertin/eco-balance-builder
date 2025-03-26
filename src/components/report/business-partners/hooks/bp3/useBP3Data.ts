
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP3FormData } from '../types';
import { BP3HookResult } from './types';

export const useBP3Data = (reportId: string): BP3HookResult => {
  const [formData, setFormData] = useState<BP3FormData>({
    hasGhgReductionTargets: false,
    ghgReductionTargetScope1: undefined,
    ghgReductionTargetScope2: undefined,
    ghgReductionTargetScope3: undefined,
    ghgReductionTargetYear: undefined,
    ghgReductionBaselineYear: undefined
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
          .from('bp3_ghg_targets')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP3 data:", error);
          }
        } else if (data) {
          setFormData({
            hasGhgReductionTargets: data.has_ghg_reduction_targets,
            ghgReductionTargetScope1: data.ghg_reduction_target_scope1,
            ghgReductionTargetScope2: data.ghg_reduction_target_scope2,
            ghgReductionTargetScope3: data.ghg_reduction_target_scope3,
            ghgReductionTargetYear: data.ghg_reduction_target_year,
            ghgReductionBaselineYear: data.ghg_reduction_baseline_year
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP3 data:", error);
        toast.error("Errore nel caricamento dei dati sugli obiettivi di riduzione GHG");
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
        .from('bp3_ghg_targets')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingRecord) {
        // Update existing record
        result = await supabase
          .from('bp3_ghg_targets')
          .update({
            has_ghg_reduction_targets: formData.hasGhgReductionTargets,
            ghg_reduction_target_scope1: formData.ghgReductionTargetScope1,
            ghg_reduction_target_scope2: formData.ghgReductionTargetScope2,
            ghg_reduction_target_scope3: formData.ghgReductionTargetScope3,
            ghg_reduction_target_year: formData.ghgReductionTargetYear,
            ghg_reduction_baseline_year: formData.ghgReductionBaselineYear,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp3_ghg_targets')
          .insert({
            report_id: reportId,
            has_ghg_reduction_targets: formData.hasGhgReductionTargets,
            ghg_reduction_target_scope1: formData.ghgReductionTargetScope1,
            ghg_reduction_target_scope2: formData.ghgReductionTargetScope2,
            ghg_reduction_target_scope3: formData.ghgReductionTargetScope3,
            ghg_reduction_target_year: formData.ghgReductionTargetYear,
            ghg_reduction_baseline_year: formData.ghgReductionBaselineYear,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP3 data:", result.error);
        toast.error("Errore nel salvataggio dei dati sugli obiettivi di riduzione GHG");
        return false;
      }
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sugli obiettivi di riduzione GHG salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP3 data:", error);
      toast.error("Errore nel salvataggio dei dati sugli obiettivi di riduzione GHG");
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
