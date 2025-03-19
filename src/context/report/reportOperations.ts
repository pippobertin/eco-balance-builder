
import { useReportDataOperations } from './reportDataOperations';
import { useReportFetchOperations } from './reportFetchOperations';

// Combine both sets of operations into a single hook
export const useReportOperations = () => {
  const dataOps = useReportDataOperations();
  const fetchOps = useReportFetchOperations();

  return {
    // Data operations
    saveReportData: dataOps.saveReportData,
    updateReportField: dataOps.updateReportField,
    deleteReport: dataOps.deleteReport,
    saveSubsidiaries: dataOps.saveSubsidiaries,
    isSaving: dataOps.isSaving,
    lastSaved: dataOps.lastSaved,
    
    // Fetch operations
    loadReportData: fetchOps.loadReportData,
    loadReports: fetchOps.loadReports,
    loadReport: fetchOps.loadReport
  };
};
