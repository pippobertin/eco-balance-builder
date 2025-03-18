
import { useReportFetchOperations } from './reportFetchOperations';
import { useReportWriteOperations } from './reportWriteOperations';
import { useReportDataOperations } from './reportDataOperations';
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
