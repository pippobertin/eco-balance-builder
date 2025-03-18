
import { useReportFetchOperations } from './reportFetchOperationsRefactored';
import { useReportWriteOperations } from './reportWriteOperationsRefactored';
import { useReportDataOperations } from './reportDataOperationsRefactored';
import { useCompanyOperations } from '../companyOperations';

export const useReportOperations = () => {
  const { loadReports, loadReport } = useReportFetchOperations();
  const { createReport, deleteReport } = useReportWriteOperations();
  const { saveReportData, saveSubsidiaries } = useReportDataOperations();
  const { loadCompanies, createCompany, loadCompanyById } = useCompanyOperations();

  return {
    // Company operations
    loadCompanies,
    createCompany,
    loadCompanyById,
    
    // Report operations
    loadReports,
    createReport,
    loadReport,
    saveReportData,
    saveSubsidiaries,
    deleteReport
  };
};
