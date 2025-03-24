
import { useState, useEffect } from 'react';
import { GovernanceFormData, SectionHookResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGovernanceData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<GovernanceFormData>({
    sustainabilityGovernance: ''
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
          .from('narrative_governance')
          .select('*')
          .eq('report_id', reportId)
          .single();
        
        if (error) {
          console.error("Error fetching governance data:", error);
          if (error.code !== 'PGRST116') { // Not found error
            toast.error("Errore nel caricamento dei dati sulla governance");
          }
        } else if (data) {
          setFormData({
            sustainabilityGovernance: data.sustainability_governance || ''
          });
          setLastSaved(new Date(data.updated_at));
          setNeedsSaving(false);
        }
      } catch (error) {
        console.error("Unexpected error fetching governance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  // Set needsSaving to true when form data changes
  useEffect(() => {
    if (!isLoading) {
      setNeedsSaving(true);
    }
  }, [formData]);

  return {
    formData,
    setFormData,
    isLoading,
    setIsLoading,
    lastSaved,
    setLastSaved,
    needsSaving,
    setNeedsSaving
  };
};
