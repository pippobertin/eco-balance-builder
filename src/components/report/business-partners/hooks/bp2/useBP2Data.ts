
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP2FormData } from '../types';
import { BP2HookResult } from './types';
import { useReport } from '@/hooks/use-report-context';

export const useBP2Data = (reportId: string): BP2HookResult => {
  const { updateReportData } = useReport();
  const [formData, setFormData] = useState<BP2FormData>({
    maleGovernanceMembers: undefined,
    femaleGovernanceMembers: undefined,
    otherGenderGovernanceMembers: undefined,
    genderDiversityIndex: undefined
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
          .from('bp2_gender_diversity')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching BP2 data:", error);
          toast.error("Errore nel caricamento dei dati sulla diversità di genere");
        } else if (data) {
          setFormData({
            maleGovernanceMembers: data.male_governance_members,
            femaleGovernanceMembers: data.female_governance_members,
            otherGenderGovernanceMembers: data.other_gender_governance_members,
            genderDiversityIndex: data.gender_diversity_index
          });
          setLastSaved(new Date(data.updated_at));
        }
      } catch (error) {
        console.error("Unexpected error fetching BP2 data:", error);
        toast.error("Errore nel caricamento dei dati sulla diversità di genere");
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
      
      // First check if record exists
      const { data: existingData } = await supabase
        .from('bp2_gender_diversity')
        .select('id')
        .eq('report_id', reportId)
        .maybeSingle();
      
      let result;
      
      if (existingData) {
        // Update existing record
        result = await supabase
          .from('bp2_gender_diversity')
          .update({
            male_governance_members: formData.maleGovernanceMembers,
            female_governance_members: formData.femaleGovernanceMembers,
            other_gender_governance_members: formData.otherGenderGovernanceMembers,
            gender_diversity_index: formData.genderDiversityIndex,
            updated_at: now.toISOString()
          })
          .eq('report_id', reportId);
      } else {
        // Insert new record
        result = await supabase
          .from('bp2_gender_diversity')
          .insert({
            report_id: reportId,
            male_governance_members: formData.maleGovernanceMembers,
            female_governance_members: formData.femaleGovernanceMembers,
            other_gender_governance_members: formData.otherGenderGovernanceMembers,
            gender_diversity_index: formData.genderDiversityIndex,
            updated_at: now.toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error saving BP2 data:", result.error);
        toast.error("Errore nel salvataggio dei dati sulla diversità di genere");
        return false;
      }
      
      // Update the global report data context with the new values
      updateReportData({
        businessPartnersMetrics: {
          bp2: formData
        }
      });
      
      setLastSaved(now);
      setNeedsSaving(false);
      toast.success("Dati sulla diversità di genere salvati con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving BP2 data:", error);
      toast.error("Errore nel salvataggio dei dati sulla diversità di genere");
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
