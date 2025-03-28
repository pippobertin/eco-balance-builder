
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
        // Ensure the report has complete company data
        if (!result.report.company || !result.report.company.name) {
          console.log("Report missing company data, attempting to load company:", result.report.company_id);
          
          // Load the company separately if it's missing
          if (result.report.company_id) {
            const company = await loadCompanyById(result.report.company_id);
            if (company) {
              console.log("Successfully loaded company data:", company.name);
              // Attach the company to the report
              result.report.company = company;
              // Also set as current company
              setCurrentCompany(company);
            } else {
              console.error("Failed to load company data for ID:", result.report.company_id);
            }
          }
        }
        
        // Now set the report with the attached company
        setCurrentReport(result.report);
        
        // Extract metrics data from the loaded report with improved parsing
        console.log("Raw data types:");
        console.log("- environmental_metrics type:", typeof result.report.environmental_metrics);
        console.log("- environmental_metrics sample:", 
          typeof result.report.environmental_metrics === 'string' 
            ? result.report.environmental_metrics.substring(0, 100) + "..." 
            : JSON.stringify(result.report.environmental_metrics).substring(0, 100) + "...");
        console.log("- social_metrics type:", typeof result.report.social_metrics);
        console.log("- conduct_metrics type:", typeof result.report.conduct_metrics);
        console.log("- materiality_analysis type:", typeof result.report.materiality_analysis);
        console.log("- business_partners_metrics type:", typeof result.report.business_partners_metrics);
        
        // Always use safeJsonParse to handle the different ways data might be stored
        const newReportData: ReportData = {
          environmentalMetrics: safeJsonParse(result.report.environmental_metrics, {}),
          socialMetrics: safeJsonParse(result.report.social_metrics, {}),
          conductMetrics: safeJsonParse(result.report.conduct_metrics, {}),
          materialityAnalysis: safeJsonParse(result.report.materiality_analysis, { issues: [], stakeholders: [] }),
          narrativePATMetrics: safeJsonParse(result.report.narrative_pat_metrics, {}),
          businessPartnersMetrics: safeJsonParse(result.report.business_partners_metrics, {})
        };
        
        console.log("Parsed report data:", {
          environmentalMetrics: Object.keys(newReportData.environmentalMetrics).length > 0 
            ? "Populated object with " + Object.keys(newReportData.environmentalMetrics).length + " keys" 
            : "Empty object",
          socialMetrics: Object.keys(newReportData.socialMetrics).length > 0 
            ? "Populated object with " + Object.keys(newReportData.socialMetrics).length + " keys" 
            : "Empty object",
          conductMetrics: Object.keys(newReportData.conductMetrics).length > 0 
            ? "Populated object with " + Object.keys(newReportData.conductMetrics).length + " keys" 
            : "Empty object",
          materialityAnalysis: Object.keys(newReportData.materialityAnalysis).length > 0 
            ? "Populated object with " + Object.keys(newReportData.materialityAnalysis).length + " keys" 
            : "Empty object",
          narrativePATMetrics: Object.keys(newReportData.narrativePATMetrics).length > 0 
            ? "Populated object with " + Object.keys(newReportData.narrativePATMetrics).length + " keys" 
            : "Empty object",
          businessPartnersMetrics: Object.keys(newReportData.businessPartnersMetrics || {}).length > 0 
            ? "Populated object with " + Object.keys(newReportData.businessPartnersMetrics || {}).length + " keys" 
            : "Empty object"
        });
        
        // Update report data state
        setReportData(newReportData);
        
        // Save the current report ID to localStorage
        localStorageUtils.saveCurrentReportId(reportId);
        
        // If the report has a company, set it as the current company
        if (result.report.company) {
          console.log("Report has company data:", result.report.company.name);
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
