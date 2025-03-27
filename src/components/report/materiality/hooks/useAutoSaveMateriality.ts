
import { useEffect, useRef } from 'react';
import { useReport } from '@/hooks/use-report-context';

interface UseAutoSaveMaterialityProps {
  materialityData: any;
}

export const useAutoSaveMateriality = ({ materialityData }: UseAutoSaveMaterialityProps) => {
  const { updateReportData, saveCurrentReport, needsSaving } = useReport();
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Update report context whenever materiality data changes
  useEffect(() => {
    if (!materialityData) return;
    
    try {
      // Stringify data for comparison to avoid unnecessary saves
      const materialityDataString = JSON.stringify(materialityData);
      
      // Only proceed if data has changed
      if (materialityDataString !== lastSavedDataRef.current) {
        console.log("Materiality data changed, updating report context...");
        
        // Update the last saved data reference
        lastSavedDataRef.current = materialityDataString;
        
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }
        
        // First, update the report data in context
        updateReportData({ materialityAnalysis: materialityData });
        
        // Set a shorter timeout to auto-save after data changes
        saveTimeoutRef.current = window.setTimeout(() => {
          console.log("Auto-saving materiality data changes...");
          saveCurrentReport().then(() => {
            console.log("Materiality data auto-saved successfully");
          }).catch(error => {
            console.error("Error auto-saving materiality data:", error);
          });
        }, 1500); // Reduced from 3000 to 1500ms for quicker saves
      }
    } catch (error) {
      console.error("Error in materiality data processing:", error);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [materialityData, updateReportData, saveCurrentReport]);

  // Add another effect to save on tab/page change
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      try {
        if (needsSaving) {
          // Auto-save on page navigation if there are unsaved changes
          saveCurrentReport().catch(console.error);
          
          // Show confirmation dialog if needed
          e.preventDefault();
          e.returnValue = '';
          return '';
        }
      } catch (error) {
        console.error("Error in beforeunload handler:", error);
      }
      return undefined;
    };
    
    // Save when navigating away
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [needsSaving, saveCurrentReport]);
};
