
import { useState } from 'react';
import { Report, ReportData, Subsidiary } from '@/context/types';
import { useReportOperations } from '../reportOperations';

export const useReportSave = (
  currentReport: Report | null,
  reportData: ReportData,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  const [loading, setLoading] = useState(false);
  const { saveReportData, saveSubsidiaries: saveSubsidiariesData } = useReportOperations();

  // Save current report
  const saveCurrentReport = async (): Promise<void> => {
    if (!currentReport) return;
    
    setLoading(true);
    const success = await saveReportData(currentReport.id, reportData);
    
    if (success) {
      console.log("Report saved to database successfully");
      setNeedsSaving(false);
      setLastSaved(new Date());
    }
    
    setLoading(false);
  };

  // Save subsidiaries
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string): Promise<void> => {
    setLoading(true);
    await saveSubsidiariesData(subsidiaries, reportId);
    setLoading(false);
  };

  return {
    loading,
    saveCurrentReport,
    saveSubsidiaries
  };
};
