
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';
import { ReportData, Report } from '@/context/types';

export const useDashboardData = (initialYear: string = "") => {
  const { toast } = useToast();
  const { reportData, currentReport, currentCompany, reports, loadReports, loadReport } = useReport();
  
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [displayData, setDisplayData] = useState<ReportData | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [accessError, setAccessError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Load company reports
  useEffect(() => {
    const loadCompanyReports = async () => {
      if (!currentCompany) return;
      
      setIsLoading(true);
      try {
        const loadedReports = await loadReports(currentCompany.id);
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
        setIsLoading(false);
      }
    };
    
    setAccessError(false);
    loadCompanyReports();
  }, [currentCompany, loadReports, toast]);
  
  // Set selected year when current report changes
  useEffect(() => {
    if (currentReport?.report_year) {
      setSelectedYear(currentReport.report_year);
    }
  }, [currentReport]);
  
  // Handle year change
  useEffect(() => {
    const handleYearChange = async () => {
      if (!selectedYear || !currentCompany) return;
      
      // If selected year matches current report, use existing data
      if (currentReport && selectedYear === currentReport.report_year) {
        setDisplayData(reportData);
        setSelectedReport(currentReport);
        return;
      }
      
      const reportForYear = reports.find(r => r.report_year === selectedYear);
      
      if (reportForYear) {
        setIsLoading(true);
        try {
          const loadReportResult = await loadReport(reportForYear.id);
          console.log("Load report result:", loadReportResult);
          
          if (loadReportResult && loadReportResult.report) {
            setSelectedReport(loadReportResult.report);
            const newReportData = {
              environmentalMetrics: loadReportResult.report.environmental_metrics || {},
              socialMetrics: loadReportResult.report.social_metrics || {},
              conductMetrics: loadReportResult.report.conduct_metrics || {},
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
          setIsLoading(false);
        }
      } else {
        setDisplayData(null);
        setSelectedReport(null);
        toast({
          title: "Nessun report",
          description: `Non esiste un report per l'anno ${selectedYear}`,
          variant: "default"
        });
      }
    };
    
    handleYearChange();
  }, [selectedYear, reports, currentReport, currentCompany, loadReport, reportData, toast]);
  
  // Update display data when currentReport matches selectedReport
  useEffect(() => {
    if (selectedReport && selectedReport.id === currentReport?.id) {
      setDisplayData(reportData);
    }
  }, [reportData, selectedReport, currentReport]);
  
  // For debugging
  useEffect(() => {
    console.log("Current report year:", currentReport?.report_year);
    console.log("Selected year:", selectedYear);
    console.log("Available reports:", reports.map(r => r.report_year));
    console.log("Display data for selected year:", displayData);
    console.log("Access error:", accessError);
  }, [currentReport, selectedYear, reports, displayData, accessError]);
  
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
