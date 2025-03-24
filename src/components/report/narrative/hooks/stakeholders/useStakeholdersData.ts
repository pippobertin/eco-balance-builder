
import { useState, useEffect } from 'react';
import { StakeholdersFormData, SectionHookResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStakeholdersData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<StakeholdersFormData>({
    keyStakeholders: '',
    stakeholderEngagement: ''
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
          .from('narrative_stakeholders')
          .select('*')
          .eq('report_id', reportId)
          .single();
        
        if (error) {
          console.error("Error fetching stakeholders data:", error);
          if (error.code !== 'PGRST116') { // Not found error
            toast.error("Errore nel caricamento dei dati sugli stakeholder");
          }
        } else if (data) {
          setFormData({
            keyStakeholders: data.stakeholder_categories || '',
            stakeholderEngagement: data.engagement_methods || ''
          });
          setLastSaved(new Date(data.updated_at));
          setNeedsSaving(false);
        }
      } catch (error) {
        console.error("Unexpected error fetching stakeholders data:", error);
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
