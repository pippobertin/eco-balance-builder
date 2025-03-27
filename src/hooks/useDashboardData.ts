
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';
import { ReportData, Report } from '@/context/types';
import { debounce } from '@/integrations/supabase/client';

export const useDashboardData = (initialYear: string = "") => {
  const { toast } = useToast();
  const { reportData, currentReport, currentCompany, reports, loadReports, loadReport } = useReport();
  
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [displayData, setDisplayData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [accessError, setAccessError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use refs to avoid multiple simultaneous operations
  const isLoadingCompanyReportsRef = useRef(false);
  const isLoadingYearReportRef = useRef(false);
  const loadReportsTimeoutRef = useRef<number | null>(null);
  
  // Debounce the load reports function to prevent multiple rapid calls
  const debouncedLoadReports = useRef(
    debounce(async (companyId: string) => {
      if (isLoadingCompanyReportsRef.current) return;
      
      isLoadingCompanyReportsRef.current = true;
      setIsLoading(true);
      
      try {
        const loadedReports = await loadReports(companyId);
        setAccessError(loadedReports.length === 0);
      } catch (error) {
        console.error("Error loading reports:", error);
        setAccessError(true);
        toast({
          title: "Errore",
          description: "Impossibile caricare i report dell'azienda",
          variant: "destructive"
        });
      } finally {
        isLoadingCompanyReportsRef.current = false;
        setIsLoading(false);
      }
    }, 300)
  ).current;
  
  // Load company reports when company changes
  useEffect(() => {
    const loadCompanyReports = async () => {
      if (!currentCompany) return;
      
      // Clear any pending timeouts
      if (loadReportsTimeoutRef.current) {
        clearTimeout(loadReportsTimeoutRef.current);
      }
      
      setAccessError(false);
      debouncedLoadReports(currentCompany.id);
      
      // Set a backup timeout to ensure we're not stuck in loading state
      loadReportsTimeoutRef.current = window.setTimeout(() => {
        if (isLoadingCompanyReportsRef.current) {
          console.log("Backup timeout triggered for loading reports");
          isLoadingCompanyReportsRef.current = false;
          setIsLoading(false);
        }
      }, 5000); // 5 second safety timeout
    };
    
    loadCompanyReports();
    
    // Cleanup function
    return () => {
      if (loadReportsTimeoutRef.current) {
        clearTimeout(loadReportsTimeoutRef.current);
      }
    };
  }, [currentCompany, debouncedLoadReports, toast]);
  
  // Set selected year when current report changes
  useEffect(() => {
    if (currentReport?.report_year && selectedYear !== currentReport.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport, selectedYear]);
  
  // Handle year change
  useEffect(() => {
    const handleYearChange = async () => {
      if (!selectedYear || !currentCompany || isLoadingYearReportRef.current) return;
      
      // If selected year matches current report, use existing data
      if (currentReport && selectedYear === currentReport.report_year) {
        setDisplayData(reportData);
        setSelectedReport(currentReport);
        return;
      }
      
      const reportForYear = reports.find(r => r.report_year === selectedYear);
      
      if (reportForYear) {
        isLoadingYearReportRef.current = true;
        setIsLoading(true);
        
        try {
          const loadReportResult = await loadReport(reportForYear.id);
          console.log("Load report result:", loadReportResult);
          
          if (loadReportResult && loadReportResult.report) {
            setSelectedReport(loadReportResult.report);
            
            // Create a new report data object with the correct structure
            const newReportData: ReportData = {
              generalInfo: reportData.generalInfo, // Keep the existing generalInfo
              environmentalMetrics: loadReportResult.report.environmental_metrics || {},
              socialMetrics: loadReportResult.report.social_metrics || {},
              governanceMetrics: reportData.governanceMetrics || {}, // Keep existing governanceMetrics
              conductMetrics: loadReportResult.report.conduct_metrics || {},
              businessPartnersMetrics: reportData.businessPartnersMetrics || {}, // Keep existing businessPartnersMetrics
              materialityAnalysis: loadReportResult.report.materiality_analysis || { issues: [], stakeholders: [] },
              narrativePATMetrics: loadReportResult.report.narrative_pat_metrics || {}
            };
            
            setDisplayData(newReportData);
            setAccessError(false);
          } else {
            console.error("Report data not found or access denied");
            setSelectedReport(null);
            setDisplayData(null);
            setAccessError(true);
          }
        } catch (error) {
          console.error("Error loading report:", error);
          setAccessError(true);
          setSelectedReport(null);
          setDisplayData(null);
          toast({
            title: "Errore",
            description: "Impossibile caricare il report selezionato",
            variant: "destructive"
          });
        } finally {
          isLoadingYearReportRef.current = false;
          setIsLoading(false);
        }
      } else {
        setDisplayData(null);
        setSelectedReport(null);
        
        // Only show toast if we have reports but not for this year
        if (reports.length > 0) {
          toast({
            title: "Nessun report",
            description: `Non esiste un report per l'anno ${selectedYear}`,
            variant: "default"
          });
        }
      }
    };
    
    handleYearChange();
  }, [selectedYear, reports, currentReport, currentCompany, loadReport, reportData, toast]);
  
  // Update display data when currentReport matches selectedReport
  useEffect(() => {
    if (selectedReport && currentReport && selectedReport.id === currentReport.id) {
      setDisplayData(reportData);
    }
  }, [reportData, selectedReport, currentReport]);
  
  // For debugging
  useEffect(() => {
    console.debug("Current report year:", currentReport?.report_year);
    console.debug("Selected year:", selectedYear);
    console.debug("Available reports:", reports.map(r => r.report_year));
    console.debug("Display data available:", !!displayData);
    console.debug("Access error:", accessError);
    console.debug("Loading state:", isLoading);
  }, [currentReport, selectedYear, reports, displayData, accessError, isLoading]);
  
  return {
    selectedYear,
    setSelectedYear,
    displayData,
    selectedReport,
    accessError,
    isLoading,
    availableYears: reports.map(r => r.report_year)
  };
};
