import { useEffect } from 'react';
import { ReportData } from '@/context/types';
import { localStorageUtils } from '../localStorageUtils';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/context/types';
import { Company } from '@/context/types';

// Hook to sync report data with local storage
export const useLocalStorageSync = (
  loadCompanyById: (companyId: string) => Promise<Company | null>,
  loadReport: (reportId: string) => Promise<{report: Report | null, subsidiaries?: any[]}>,
  loadReports: (companyId: string) => Promise<Report[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>
) => {
  const { toast } = useToast();
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load current company ID from localStorage
        const currentCompanyId = localStorageUtils.getCurrentCompanyId();
        if (currentCompanyId) {
          console.log("Found company ID in localStorage:", currentCompanyId);
          const company = await loadCompanyById(currentCompanyId);
          if (company) {
            console.log("Loaded company from ID:", company.name);
            setCurrentCompany(company);
            await loadReports(company.id);
          } else {
            console.warn("Company ID in localStorage not found in database");
            localStorageUtils.removeCurrentCompanyId();
          }
        }
        
        // Load current report ID from localStorage
        const currentReportId = localStorageUtils.getCurrentReportId();
        if (currentReportId) {
          console.log("Found report ID in localStorage:", currentReportId);
          const reportResult = await loadReport(currentReportId);
          if (reportResult.report) {
            console.log("Loaded report from ID:", reportResult.report.id);
            setCurrentReport(reportResult.report);
          } else {
            console.warn("Report ID in localStorage not found in database");
            localStorageUtils.removeCurrentReportId();
          }
        }
      } catch (error: any) {
        console.error("Error loading data from localStorage:", error.message);
        toast({
          title: "Errore",
          description: `Impossibile caricare i dati dalla cache locale: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [loadCompanyById, loadReport, loadReports, setCurrentCompany, setCurrentReport, setLoading, toast]);
  
  // Save report data to localStorage on change
  useEffect(() => {
    const saveReportData = (data: ReportData) => {
      try {
        // We now have materialityAnalysis in the ReportData type
        const serializedData = JSON.stringify({
          environmentalMetrics: data.environmentalMetrics,
          socialMetrics: data.socialMetrics,
          governanceMetrics: data.governanceMetrics,
          conductMetrics: data.conductMetrics,
          businessPartnersMetrics: data.businessPartnersMetrics,
          materialityAnalysis: data.materialityAnalysis,
          narrativePATMetrics: data.narrativePATMetrics
        });
        
        localStorage.setItem('reportData', serializedData);
        console.log("Report data saved to localStorage");
      } catch (error) {
        console.error("Error saving report data to localStorage:", error);
      }
    };
    
    // Retrieve reportData from localStorage
    const storedReportData = localStorage.getItem('reportData');
    if (storedReportData) {
      try {
        const parsedReportData = JSON.parse(storedReportData);
        setReportData(parsedReportData);
      } catch (error) {
        console.error("Error parsing report data from localStorage:", error);
      }
    }
    
  }, [setReportData]);
};
