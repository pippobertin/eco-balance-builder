
import { useEffect } from 'react';
import { Report, ReportData } from '@/context/types';

export const useReportAutoSave = (
  needsSaving: boolean,
  reportData: ReportData,
  currentReport: Report | null,
  saveCurrentReport: () => Promise<boolean | undefined>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  // Set needsSaving flag when report data changes
  useEffect(() => {
    if (currentReport) {
      setNeedsSaving(true);
    }
  }, [reportData, currentReport, setNeedsSaving]);

  // Auto-save report data every 30 seconds if there are changes
  useEffect(() => {
    if (!needsSaving || !currentReport) return;
    
    const timer = setTimeout(async () => {
      const success = await saveCurrentReport();
      if (success) {
        setNeedsSaving(false);
        setLastSaved(new Date());
      }
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, [needsSaving, reportData, currentReport, saveCurrentReport, setNeedsSaving, setLastSaved]);
};
