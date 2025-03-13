
import { useEffect, useRef } from 'react';
import { useReport } from '@/context/ReportContext';

interface UseAutoSaveMaterialityProps {
  materialityData: any;
}

export const useAutoSaveMateriality = ({ materialityData }: UseAutoSaveMaterialityProps) => {
  const { updateReportData, saveCurrentReport, needsSaving } = useReport();
  const saveTimeoutRef = useRef<number | null>(null);

  // Update report context whenever materiality data changes
  useEffect(() => {
    if (materialityData) {
      console.log("Materiality data changed, updating report context...", materialityData);
      
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // First, update the report data in context
      updateReportData({ materialityAnalysis: materialityData });
      
      // Set a timeout to auto-save after data changes
      saveTimeoutRef.current = window.setTimeout(() => {
        console.log("Auto-saving materiality data changes...");
        saveCurrentReport().then(() => {
          console.log("Materiality data auto-saved successfully");
        }).catch(error => {
          console.error("Error auto-saving materiality data:", error);
        });
      }, 3000);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [materialityData, updateReportData, saveCurrentReport]);

  // Add another effect to save on tab/page change
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (needsSaving) {
        // Auto-save on page navigation if there are unsaved changes
        saveCurrentReport().catch(console.error);
        
        // Show confirmation dialog if needed
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    // Save when navigating away
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [needsSaving, saveCurrentReport]);
};
