
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReportData } from '@/context/types';

export type ReportSaveHook = {
  isSaving: boolean;
  saveReport: (reportId: string, data: ReportData) => Promise<boolean>;
};

export const useReportSave = (): ReportSaveHook => {
  const [isSaving, setIsSaving] = useState(false);

  const saveReport = useCallback(async (reportId: string, data: ReportData): Promise<boolean> => {
    if (!reportId) return false;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          environmental_metrics: data.environmentalMetrics || {},
          social_metrics: data.socialMetrics || {},
          conduct_metrics: data.conductMetrics || {},
          materiality_analysis: data.materialityAnalysis || { issues: [], stakeholders: [] },
          narrative_pat_metrics: data.narrativePATMetrics || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);
        
      if (error) {
        console.error("Error saving report data:", error);
        toast.error("Errore nel salvataggio dei dati del report");
        return false;
      }
      
      toast.success("Report salvato con successo");
      return true;
    } catch (error) {
      console.error("Unexpected error saving report data:", error);
      toast.error("Errore nel salvataggio dei dati del report");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { isSaving, saveReport };
};
