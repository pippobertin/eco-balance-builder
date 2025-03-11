
import { useEffect, useRef } from 'react';
import { Report, ReportData } from '@/context/types';

export const useReportAutoSave = (
  needsSaving: boolean,
  reportData: ReportData,
  currentReport: Report | null,
  saveCurrentReport: () => Promise<void>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set needsSaving flag when report data changes
  useEffect(() => {
    if (currentReport) {
      setNeedsSaving(true);
    }
  }, [reportData, currentReport, setNeedsSaving]);

  // Auto-save report data every 30 seconds if there are changes
  useEffect(() => {
    if (!needsSaving || !currentReport) {
      // Clear any existing timeout if no saving is needed
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      return;
    }
    
    console.log("Setting up auto-save timer for report", currentReport.id);
    
    // Clear any existing timer to avoid multiple timers running
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      console.log("Auto-saving report...");
      try {
        await saveCurrentReport();
        console.log("Auto-save completed successfully");
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // 30 seconds
    
    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        console.log("Clearing auto-save timer");
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [needsSaving, reportData, currentReport, saveCurrentReport]);
};
