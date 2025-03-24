
import { useState, useEffect } from 'react';
import { MaterialIssuesFormData, SectionHookResult } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMaterialIssuesData = (reportId: string): SectionHookResult => {
  const [formData, setFormData] = useState<MaterialIssuesFormData>({
    materialIssuesDescription: ''
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
          .from('narrative_material_issues')
          .select('*')
          .eq('report_id', reportId)
          .single();
        
        if (error) {
          console.error("Error fetching material issues data:", error);
          if (error.code !== 'PGRST116') { // Not found error
            toast.error("Errore nel caricamento dei dati sulle questioni materiali");
          }
        } else if (data) {
          setFormData({
            materialIssuesDescription: data.material_issues_description || ''
          });
          setLastSaved(new Date(data.updated_at));
          setNeedsSaving(false);
        }
      } catch (error) {
        console.error("Unexpected error fetching material issues data:", error);
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
