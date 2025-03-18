
import { useState } from 'react';
import { Company, Report, ReportData, defaultReportData } from '@/context/types';
import { useReportOperations } from '../reportOperations';
import { useToast } from '@/hooks/use-toast';
import { localStorageUtils } from '../localStorageUtils';

export const useReportLoad = (
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>,
  setReports: React.Dispatch<React.SetStateAction<Report[]>>,
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { loadReports: fetchReports, loadReport: fetchReport } = useReportOperations();

  // Load all companies
  const loadCompanies = async (): Promise<void> => {
    setLoading(true);
    try {
      console.info("Initial companies fetch");
      // Fetch companies from Supabase
      const { data: companies, error } = await fetchCompanies();
      if (error) throw error;

      console.info("Companies loaded:", companies.length);
      setCompanies(companies);
    } catch (error: any) {
      console.error("Error loading companies:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare le aziende: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load company by ID
  const loadCompanyById = async (companyId: string): Promise<Company | null> => {
    setLoading(true);
    try {
      // Fetch company from Supabase
      const { data: company, error } = await fetchCompanyById(companyId);
      if (error) throw error;

      return company;
    } catch (error: any) {
      console.error("Error loading company:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare l'azienda: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load reports for a specific company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    setLoading(true);
    try {
      console.info("Loading reports for company:", companyId);
      const reports = await fetchReports(companyId);
      console.info("Loaded reports:", reports.length);
      setReports(reports);
      return reports;
    } catch (error: any) {
      console.error("Error loading reports:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare i report: ${error.message}`,
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{report: Report | null, subsidiaries?: any[]}> => {
    setLoading(true);
    try {
      const result = await fetchReport(reportId);
      
      if (result.report) {
        setCurrentReport(result.report);
        
        // Clear previous report data before loading the new one
        setReportData(defaultReportData);
        
        // Extract metrics data from the loaded report
        const newReportData: ReportData = {
          environmentalMetrics: result.report.environmental_metrics || {},
          socialMetrics: result.report.social_metrics || {},
          conductMetrics: result.report.conduct_metrics || {},
          materialityAnalysis: result.report.materiality_analysis || { issues: [], stakeholders: [] },
          narrativePATMetrics: result.report.narrative_pat_metrics || {}
        };
        
        // Update report data state
        setReportData(newReportData);
        
        // Save the current report ID to localStorage
        localStorageUtils.saveCurrentReportId(reportId);
        
        // If the report has a company, set it as the current company
        if (result.report.company) {
          console.info("Report has company data:", result.report.company.name);
          setCurrentCompany(result.report.company);
          localStorageUtils.saveCurrentCompanyId(result.report.company_id);
        }
      }
      
      return result;
    } catch (error: any) {
      console.error("Error loading report:", error.message);
      toast({
        title: "Errore",
        description: `Impossibile caricare il report: ${error.message}`,
        variant: "destructive"
      });
      return { report: null };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    loadCompanies,
    loadCompanyById,
    loadReports,
    loadReport
  };
};

// Fetch companies - This would be defined in reportOperations, but is mocked here for the hook
const fetchCompanies = async () => {
  // This would call supabase but will be handled by the actual reportOperations
  return { data: [], error: null };
};

// Fetch company by ID - This would be defined in reportOperations, but is mocked here for the hook
const fetchCompanyById = async (companyId: string) => {
  // This would call supabase but will be handled by the actual reportOperations
  return { data: null, error: null };
};
