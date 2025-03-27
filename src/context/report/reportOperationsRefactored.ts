
import { useReportFetchOperations } from './reportFetchOperationsRefactored';
import { useReportWriteOperations } from './reportWriteOperationsRefactored';
import { useReportDataOperations } from './reportDataOperationsRefactored';

export const useReportOperations = () => {
  const { loadReports, loadReport } = useReportFetchOperations();
  const { createReport, deleteReport } = useReportWriteOperations();
  const { saveReportData, saveSubsidiaries } = useReportDataOperations();

  return { 
    loadReports, 
    createReport, 
    loadReport, 
    saveReportData, 
    saveSubsidiaries,
    deleteReport
  };
};
