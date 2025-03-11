
import { useReportFetchOperations } from './reportFetchOperations';
import { useReportWriteOperations } from './reportWriteOperations';
import { useReportDataOperations } from './reportDataOperations';

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
