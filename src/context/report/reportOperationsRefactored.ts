
import { useReportFetchOperations } from './reportFetchOperationsRefactored';
import { useReportWriteOperationsRefactored } from './reportWriteOperationsRefactored';
import { useReportDataOperations } from './reportDataOperationsRefactored';

export const useReportOperations = () => {
  const { loadReports, loadReport } = useReportFetchOperations();
  const { createReport, deleteReport } = useReportWriteOperationsRefactored();
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
