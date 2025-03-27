
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReportData } from '@/context/types';
import { Subsidiary } from '@/context/types';

export type ReportSaveHook = {
  isSaving: boolean;
  saveReport: (reportId: string, data: ReportData) => Promise<boolean>;
  saveCurrentReport: () => Promise<void>;
  saveSubsidiaries: (subsidiaries: Subsidiary[], reportId: string) => Promise<void>;
  loading?: boolean;
};

export const useReportSave = (
  currentReport?: any,
  reportData?: ReportData,
  setNeedsSaving?: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved?: React.Dispatch<React.SetStateAction<Date | null>>
): ReportSaveHook => {
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

  // Save current report data
  const saveCurrentReport = useCallback(async (): Promise<void> => {
    if (!currentReport || !currentReport.id || !reportData) {
      console.log("Cannot save report: missing current report or data");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await saveReport(currentReport.id, reportData);
      
      if (success && setNeedsSaving && setLastSaved) {
        setNeedsSaving(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Error saving current report:", error);
      toast.error("Errore nel salvataggio del report");
    } finally {
      setIsSaving(false);
    }
  }, [currentReport, reportData, saveReport, setNeedsSaving, setLastSaved]);

  // Save subsidiaries
  const saveSubsidiaries = useCallback(async (subsidiaries: Subsidiary[], reportId: string): Promise<void> => {
    if (!reportId) {
      console.log("Cannot save subsidiaries: missing report ID");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // First, delete existing subsidiaries for this report
      const { error: deleteError } = await supabase
        .from('subsidiaries')
        .delete()
        .eq('report_id', reportId);
        
      if (deleteError) {
        console.error("Error deleting existing subsidiaries:", deleteError);
        toast.error("Errore nell'aggiornamento delle imprese figlie");
        return;
      }
      
      // Then, insert new subsidiaries
      if (subsidiaries.length > 0) {
        const subsidiariesToInsert = subsidiaries.map(sub => ({
          name: sub.name,
          location: sub.location,
          report_id: reportId
        }));
        
        const { error: insertError } = await supabase
          .from('subsidiaries')
          .insert(subsidiariesToInsert);
          
        if (insertError) {
          console.error("Error inserting subsidiaries:", insertError);
          toast.error("Errore nel salvataggio delle imprese figlie");
          return;
        }
      }
      
      toast.success("Imprese figlie salvate con successo");
      
      if (setNeedsSaving && setLastSaved) {
        setNeedsSaving(false);
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error("Unexpected error saving subsidiaries:", error);
      toast.error("Errore nel salvataggio delle imprese figlie");
    } finally {
      setIsSaving(false);
    }
  }, [setNeedsSaving, setLastSaved]);

  return { 
    isSaving, 
    saveReport, 
    saveCurrentReport, 
    saveSubsidiaries,
    loading: isSaving 
  };
};
