
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP2FormData } from '../types';
import { BP2HookResult } from './types';

export const useBP2Data = (reportId: string): BP2HookResult => {
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
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("Error fetching BP2 data:", error);
          }
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
      
      const { error } = await supabase
        .from('bp2_gender_diversity')
        .upsert({
          report_id: reportId,
          male_governance_members: formData.maleGovernanceMembers,
          female_governance_members: formData.femaleGovernanceMembers,
          other_gender_governance_members: formData.otherGenderGovernanceMembers,
          gender_diversity_index: formData.genderDiversityIndex,
          updated_at: now.toISOString()
        }, { onConflict: 'report_id' });
        
      if (error) {
        console.error("Error saving BP2 data:", error);
        toast.error("Errore nel salvataggio dei dati sulla diversità di genere");
        return false;
      }
      
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
