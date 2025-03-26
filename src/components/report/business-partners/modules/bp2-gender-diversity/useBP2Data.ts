
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BP2FormData, BP2HookResult } from './types';
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
  const [initialLoad, setInitialLoad] = useState(true);

  // Track initial formData for comparison
  const [initialFormData, setInitialFormData] = useState<BP2FormData>({
    maleGovernanceMembers: undefined,
    femaleGovernanceMembers: undefined,
    otherGenderGovernanceMembers: undefined,
    genderDiversityIndex: undefined
  });

  // Load data from database
  useEffect(() => {
    const fetchData = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      
      try {
        console.log("BP2: Fetching data for report:", reportId);
        const { data, error } = await supabase
          .from('bp2_gender_diversity')
          .select('*')
          .eq('report_id', reportId)
          .maybeSingle();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is expected for new reports
            console.error("BP2: Error fetching data:", error);
            toast.error("Errore nel caricamento dei dati sulla diversità di genere");
          }
        } else if (data) {
          console.log("BP2: Data loaded:", data);
          const loadedData = {
            maleGovernanceMembers: data.male_governance_members,
            femaleGovernanceMembers: data.female_governance_members,
            otherGenderGovernanceMembers: data.other_gender_governance_members,
            genderDiversityIndex: data.gender_diversity_index
          };
          
          setFormData(loadedData);
          setInitialFormData(JSON.parse(JSON.stringify(loadedData))); // Deep copy to avoid reference issues
          
          if (data.updated_at) {
            setLastSaved(new Date(data.updated_at));
            console.log("BP2: Last saved time set to:", new Date(data.updated_at).toISOString());
          }
        }
      } catch (error) {
        console.error("BP2: Unexpected error fetching data:", error);
        toast.error("Errore nel caricamento dei dati sulla diversità di genere");
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
        setNeedsSaving(false);
        console.log("BP2: Initial load complete, isLoading set to false");
      }
    };

    fetchData();
  }, [reportId]);

  // Update needsSaving state when form data changes
  useEffect(() => {
    if (initialLoad) return;

    // Check if any values have changed from initial data
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);

    console.log("BP2: Form data changed, checking for changes:", { 
      hasChanges, 
      formData, 
      initialFormData 
    });
    
    setNeedsSaving(hasChanges);
  }, [formData, initialFormData, initialLoad]);

  // Save data to the database
  const saveData = useCallback(async (): Promise<void> => {
    if (!reportId) return;
    
    console.log("BP2: Saving gender diversity data for report:", reportId);
    
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
        console.error("BP2: Error saving data:", error);
        toast.error("Errore nel salvataggio dei dati sulla diversità di genere");
        return;
      }
      
      // Update initial data to match current data after successful save
      setInitialFormData(JSON.parse(JSON.stringify(formData))); // Deep copy
      setLastSaved(now);
      setNeedsSaving(false);
      console.log("BP2: Data saved successfully, lastSaved set to:", now.toISOString());
      
      toast.success("Dati sulla diversità di genere salvati con successo");
      
      // Update global report context
      updateReportData({
        businessPartnersMetrics: {
          bp2: {
            ...formData
          }
        }
      });
    } catch (error) {
      console.error("BP2: Unexpected error saving data:", error);
      toast.error("Errore nel salvataggio dei dati sulla diversità di genere");
    }
  }, [reportId, formData, updateReportData]);

  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    lastSaved,
    needsSaving
  };
};
