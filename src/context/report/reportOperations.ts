
import { useReportFetchOperations } from './reportFetchOperations';
import { useReportWriteOperations } from './reportWriteOperations';
import { useReportDataOperations } from './reportDataOperations';
import { useCompanyOperations } from '../companyOperations';

export const useReportOperations = () => {
  // Use updated imports for the operations
  const fetchOperations = useReportFetchOperations();
  const writeOperations = useReportWriteOperations();
  const dataOperations = useReportDataOperations();
  const companyOperations = useCompanyOperations();

  return {
    // Company operations
    loadCompanies: companyOperations.loadCompanies,
    createCompany: companyOperations.createCompany,
    loadCompanyById: companyOperations.loadCompanyById,
    
    // Report operations
    loadReports: fetchOperations.loadReports,
    createReport: writeOperations.createReport,
    loadReport: fetchOperations.loadReport,
    saveReportData: dataOperations.saveReportData,
    deleteReport: dataOperations.deleteReport
  };
};
