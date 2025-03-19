
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
  const lastSavedDataRef = useRef<string>('');
  
  // Setup auto-save when report data changes
  useEffect(() => {
    if (needsSaving && currentReport && reportData) {
      try {
        // Convert report data to string for comparison
        const currentDataString = JSON.stringify(reportData);
        
        // Skip if data hasn't actually changed
        if (currentDataString === lastSavedDataRef.current) {
          return;
        }
        
        // Clear any existing timer
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        
        // Set a new timer for auto-save (shorter - 3 seconds)
        autoSaveTimerRef.current = setTimeout(async () => {
          console.log("Auto-saving report data:", JSON.stringify(reportData));
          await saveCurrentReport();
          // Update last saved reference
          lastSavedDataRef.current = currentDataString;
        }, 3000); // Auto-save after 3 seconds of inactivity
      } catch (error) {
        console.error("Error in auto-save:", error);
      }
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

  // Add a safety mechanism to ensure data is saved before navigation
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (needsSaving) {
        try {
          // Force save data before navigation
          await saveCurrentReport();
        } catch (error) {
          console.error("Error saving before unload:", error);
          // Show confirmation dialog if save failed
          e.preventDefault();
          e.returnValue = '';
          return '';
        }
      }
      return undefined;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [needsSaving, saveCurrentReport]);

  // Return the needsSaving state so it can be used in navigation guards
  return {
    needsSaving
  };
};
