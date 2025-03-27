
import { useState } from 'react';
import { Report, ReportData, Subsidiary } from '@/context/types';
import { useReportOperations } from '../reportOperations';
import { toast } from 'sonner';

export const useReportSave = (
  currentReport: Report | null,
  reportData: ReportData,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const [loading, setLoading] = useState(false);
  const { saveReportData, saveSubsidiaries } = useReportOperations();

  // Save current report
  const saveCurrentReport = async (): Promise<void> => {
    if (!currentReport) {
      console.log("No current report to save");
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      console.log("Saving report data to database...");
      console.log("Report data being saved:", JSON.stringify(reportData));
      
      if (currentReport?.id) {
        console.log("Current report exists:", currentReport.id);
        const success = await saveReportData(currentReport.id, reportData);
        
        if (success) {
          console.log("Report saved to database successfully");
          setNeedsSaving(false);
          setLastSaved(new Date());
          // Show success toast
          toast.success("Dati salvati con successo");
        } else {
          console.error("Failed to save report data");
          toast.error("Non è stato possibile salvare il report");
        }
      } else {
        console.error("Report ID is undefined, cannot save");
        toast.error("ID Report non valido, impossibile salvare");
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Si è verificato un errore durante il salvataggio del report");
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  // Save subsidiaries
  const saveSubsidiariesHandler = async (subsidiaries: Subsidiary[]): Promise<void> => {
    if (!currentReport?.id) {
      console.log("No report ID provided for saving subsidiaries");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log(`Saving ${subsidiaries.length} subsidiaries for report ${currentReport.id}`);
      await saveSubsidiaries(subsidiaries, currentReport.id);
      toast.success("Controllate salvate con successo");
    } catch (error) {
      console.error("Error saving subsidiaries:", error);
      toast.error("Non è stato possibile salvare le controllate");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    saveCurrentReport,
    saveSubsidiaries: saveSubsidiariesHandler
  };
};
