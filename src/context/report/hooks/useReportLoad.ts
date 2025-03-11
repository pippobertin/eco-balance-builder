
import { useState } from 'react';
import { Company, Report, ReportData, Subsidiary } from '@/context/types';
import { useCompanyOperations } from '@/context/companyOperations';
import { useReportOperations } from '../reportOperations';

export const useReportLoad = (
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>,
  setReports: React.Dispatch<React.SetStateAction<Report[]>>,
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>
) => {
  const [loading, setLoading] = useState(false);
  const { loadCompanies: fetchCompanies, loadCompanyById: fetchCompanyById } = useCompanyOperations();
  const { loadReports: fetchReports, loadReport: fetchReport } = useReportOperations();

  // Load companies
  const loadCompanies = async () => {
    setLoading(true);
    const data = await fetchCompanies();
    setCompanies(data);
    setLoading(false);
  };

  // Load reports for a company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    setLoading(true);
    const data = await fetchReports(companyId);
    setReports(data as Report[]);
    setLoading(false);
    return data as Report[];
  };

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{report: Report | null, subsidiaries?: Subsidiary[]}> => {
    setLoading(true);
    const result = await fetchReport(reportId);
    
    if (result.report) {
      setCurrentReport(result.report as Report);
      
      // Load report data
      const newReportData: ReportData = {
        environmentalMetrics: result.report.environmental_metrics || {},
        socialMetrics: result.report.social_metrics || {},
        conductMetrics: result.report.conduct_metrics || {},
        materialityAnalysis: result.report.materiality_analysis || { issues: [], stakeholders: [] },
        narrativePATMetrics: result.report.narrative_pat_metrics || {}
      };
      
      setReportData(newReportData);
    }
    
    setLoading(false);
    return result as {report: Report | null, subsidiaries?: Subsidiary[]};
  };

  // Load company by ID
  const loadCompanyById = async (companyId: string): Promise<Company | null> => {
    setLoading(true);
    const company = await fetchCompanyById(companyId);
    if (company) {
      setCurrentCompany(company);
    }
    setLoading(false);
    return company;
  };

  return {
    loading,
    loadCompanies,
    loadReports,
    loadReport,
    loadCompanyById
  };
};
