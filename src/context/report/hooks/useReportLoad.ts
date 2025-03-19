import { useState } from 'react';
import { Company, Report, ReportData, defaultReportData } from '@/context/types';
import { useReportOperations } from '../reportOperations';
import { useCompanyOperations } from '@/context/companyOperations';
import { useToast } from '@/hooks/use-toast';
import { localStorageUtils } from '../localStorageUtils';
import { safeJsonParse } from '@/integrations/supabase/utils/jsonUtils';

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
  const { loadCompanies: fetchCompanies, loadCompanyById: fetchCompanyById } = useCompanyOperations();

  // Load all companies
  const loadCompanies = async (): Promise<void> => {
    setLoading(true);
    try {
      console.info("Initial companies fetch in useReportLoad");
      const companies = await fetchCompanies();
      console.info("Companies loaded in useReportLoad:", companies.length);
      setCompanies(companies);
    } catch (error: any) {
      console.error("Error loading companies in useReportLoad:", error.message);
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
      const company = await fetchCompanyById(companyId);
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
      console.log("Loading report data for report ID:", reportId);
      const result = await fetchReport(reportId);
      
      if (result.report) {
        setCurrentReport(result.report);
        
        // Extract metrics data from the loaded report with improved parsing
        const newReportData: ReportData = {
          environmentalMetrics: safeJsonParse(result.report.environmental_metrics, {}),
          socialMetrics: safeJsonParse(result.report.social_metrics, {}),
          conductMetrics: safeJsonParse(result.report.conduct_metrics, {}),
          materialityAnalysis: safeJsonParse(result.report.materiality_analysis, { issues: [], stakeholders: [] }),
          narrativePATMetrics: safeJsonParse(result.report.narrative_pat_metrics, {})
        };
        
        console.log("Setting report data from loaded report:", JSON.stringify(newReportData));
        
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
      } else {
        console.error("No report data found for report ID:", reportId);
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
