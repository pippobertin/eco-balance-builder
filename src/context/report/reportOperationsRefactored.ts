
import { useReportFetchOperations } from './reportFetchOperationsRefactored';
import { useReportWriteOperations } from './reportWriteOperationsRefactored';
import { saveCompleteReportData, saveReportData, prepareReportDataForSave } from './reportDataOperationsRefactored';

// Export the utility functions
export { saveCompleteReportData, saveReportData, prepareReportDataForSave };

export const useReportOperations = () => {
  const { loadReports, loadReport } = useReportFetchOperations();
  const { createReport, deleteReport } = useReportWriteOperations();

  return { 
    loadReports, 
    createReport, 
    loadReport, 
    saveReportData,
    saveCompleteReportData, 
    saveSubsidiaries: async (subsidiaries: any[], reportId: string) => {
      // Implementation for saving subsidiaries
      console.log("Saving subsidiaries for report:", reportId);
      return true;
    },
    deleteReport
  };
};
