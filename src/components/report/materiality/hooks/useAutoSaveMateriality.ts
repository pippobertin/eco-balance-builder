import { useState, useEffect, useCallback } from 'react';
import { useReport } from '@/hooks/use-report-context';

interface AutoSaveMaterialityProps {
  formValues: any;
  needsSaving: boolean;
  updateReportData: (data: any) => void;
  reportId: string | undefined;
}

export const useAutoSaveMateriality = ({
  formValues,
  needsSaving,
  updateReportData,
  reportId
}: AutoSaveMaterialityProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { saveCurrentReport } = useReport();
  
  const saveData = async () => {
    if (!needsSaving || !formValues || !reportId) return;
    
    try {
      setIsSaving(true);
      
      // Update the report data with the materiality analysis
      updateReportData({
        // This property now exists in the ReportData type
        materialityAnalysis: formValues.materialityAnalysis || { issues: [], stakeholders: [] }
      });
      
      // Save the current report
      await saveCurrentReport();
      
      // Update the last saved timestamp
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving materiality analysis:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Use useCallback to memoize the saveData function
  const memoizedSaveData = useCallback(saveData, [needsSaving, formValues, reportId, updateReportData, saveCurrentReport]);

  // Automatically save data when needsSaving changes
  useEffect(() => {
    if (needsSaving && reportId) {
      memoizedSaveData();
    }
  }, [needsSaving, reportId, memoizedSaveData]);

  return { isSaving, lastSaved };
};
