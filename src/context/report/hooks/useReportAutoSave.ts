
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
  // Create auto-save functionality
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup auto-save when report data changes
  useEffect(() => {
    if (needsSaving && currentReport && reportData) {
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set a new timer for auto-save (much shorter - 3 seconds)
      autoSaveTimerRef.current = setTimeout(async () => {
        console.log("Auto-saving report...");
        await saveCurrentReport();
      }, 3000); // Auto-save after 3 seconds of inactivity
    }
    
    // Clean up timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [reportData, needsSaving, currentReport, saveCurrentReport]);

  // Track when report data changes to set the needsSaving flag
  useEffect(() => {
    if (currentReport) {
      setNeedsSaving(true);
    }
  }, [reportData, currentReport, setNeedsSaving]);

  // Return the needsSaving state so it can be used in navigation guards
  return {
    needsSaving
  };
};
