import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCompanyOperations } from './companyOperations';
import { useReportOperations } from './reportOperations';
import { localStorageOperations } from './localStorage';
import { 
  Company, 
  Report, 
  Subsidiary, 
  ReportData, 
  defaultReportData 
} from './types';

export const useReportState = () => {
  // State
  const [reportData, setReportData] = useState<ReportData>(defaultReportData);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  const { toast } = useToast();

  // Hooks
  const { loadCompanies: fetchCompanies, createCompany, loadCompanyById } = useCompanyOperations();
  const { 
    loadReports: fetchReports, 
    createReport: createNewReport, 
    loadReport: fetchReport, 
    saveReportData, 
    saveSubsidiaries: saveSubsidiariesData,
    deleteReport: deleteReportData
  } = useReportOperations();

  // Load companies on initial render
  useEffect(() => {
    loadCompanies();
  }, []);

  // Restore current company and report from localStorage
  useEffect(() => {
    try {
      const savedCompanyId = localStorageOperations.getCurrentCompanyId();
      const savedReportId = localStorageOperations.getCurrentReportId();
      
      if (savedCompanyId && savedReportId) {
        // Load current company and report on initial load
        const loadCurrentData = async () => {
          setLoading(true);
          
          // Load company
          const companyData = await loadCompanyById(savedCompanyId);
          
          if (companyData) {
            setCurrentCompany(companyData);
            
            // Load report
            const { report, subsidiaries } = await fetchReport(savedReportId);
            
            if (report) {
              setCurrentReport(report);
              
              // Load report data
              const newReportData: ReportData = {
                environmentalMetrics: report.environmental_metrics || {},
                socialMetrics: report.social_metrics || {},
                conductMetrics: report.conduct_metrics || {},
                materialityAnalysis: report.materiality_analysis || { issues: [], stakeholders: [] },
                narrativePATMetrics: report.narrative_pat_metrics || {}
              };
              
              setReportData(newReportData);
              
              // Also fetch all other reports for this company to have them available
              await loadReports(savedCompanyId);
            }
          }
          
          setLoading(false);
        };
        
        loadCurrentData();
      }
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      setLoading(false);
    }
  }, []);

  // Save current company and report IDs to localStorage when they change
  useEffect(() => {
    if (currentCompany) {
      localStorageOperations.saveCurrentCompanyId(currentCompany.id);
    }
    
    if (currentReport) {
      localStorageOperations.saveCurrentReportId(currentReport.id);
    }
  }, [currentCompany, currentReport]);

  // Set needsSaving flag when report data changes
  useEffect(() => {
    if (currentReport) {
      setNeedsSaving(true);
    }
  }, [reportData]);

  // Auto-save report data every 30 seconds if there are changes
  useEffect(() => {
    if (!needsSaving || !currentReport) return;
    
    const timer = setTimeout(async () => {
      await saveCurrentReport();
      setNeedsSaving(false);
      setLastSaved(new Date());
    }, 30000); // 30 seconds
    
    return () => clearTimeout(timer);
  }, [needsSaving, reportData, currentReport]);

  // Load companies
  const loadCompanies = async () => {
    setLoading(true);
    const data = await fetchCompanies();
    setCompanies(data);
    setLoading(false);
  };

  // Create company
  const handleCreateCompany = async (company: Omit<Company, 'id'>): Promise<string | null> => {
    setLoading(true);
    const companyId = await createCompany(company);
    
    if (companyId) {
      // Reload companies to get the new one
      await loadCompanies();
    }
    
    setLoading(false);
    return companyId;
  };

  // Load reports for a company
  const loadReports = async (companyId: string): Promise<Report[]> => {
    setLoading(true);
    const data = await fetchReports(companyId);
    setReports(data);
    setLoading(false);
    return data;
  };

  // Create report
  const handleCreateReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    setLoading(true);
    const reportId = await createNewReport(report);
    
    if (reportId) {
      // Load the new report data
      const { report: newReport } = await fetchReport(reportId);
      
      if (newReport) {
        setReports(prev => [...prev, newReport]);
        setCurrentReport(newReport);
        
        // Initialize report data
        setReportData(defaultReportData);
      }
    }
    
    setLoading(false);
    return reportId;
  };

  // Load a specific report
  const loadReport = async (reportId: string): Promise<{report: Report | null, subsidiaries?: Subsidiary[]}> => {
    setLoading(true);
    const result = await fetchReport(reportId);
    
    if (result.report) {
      setCurrentReport(result.report);
      
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
    return result;
  };

  // Save subsidiaries
  const saveSubsidiaries = async (subsidiaries: Subsidiary[], reportId: string) => {
    setLoading(true);
    await saveSubsidiariesData(subsidiaries, reportId);
    setLoading(false);
  };

  // Save current report
  const saveCurrentReport = async () => {
    if (!currentReport) return;
    
    setLoading(true);
    const success = await saveReportData(currentReport.id, reportData);
    
    if (success) {
      console.log("Report saved to database successfully");
      setNeedsSaving(false);
      setLastSaved(new Date());
    }
    
    setLoading(false);
  };

  // Update report data
  const updateReportData = (newData: Partial<ReportData>) => {
    setReportData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData,
        environmentalMetrics: {
          ...prevData.environmentalMetrics,
          ...(newData.environmentalMetrics || {})
        },
        socialMetrics: {
          ...prevData.socialMetrics,
          ...(newData.socialMetrics || {})
        },
        conductMetrics: {
          ...prevData.conductMetrics,
          ...(newData.conductMetrics || {})
        },
        materialityAnalysis: {
          ...prevData.materialityAnalysis,
          ...(newData.materialityAnalysis || {})
        }
      };
      
      console.log("Report data updated:", updatedData);
      return updatedData;
    });
  };

  // Reset report data
  const resetReportData = () => {
    setReportData(defaultReportData);
  };

  // Handle delete report
  const handleDeleteReport = async (reportId: string): Promise<boolean> => {
    setLoading(true);
    const success = await deleteReportData(reportId);
    
    if (success) {
      // Remove the deleted report from the reports array
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast({
        title: "Report eliminato con successo",
      });
      if (currentReport && currentReport.id === reportId) {
        setCurrentReport(null);
        resetReportData();
        localStorageOperations.removeCurrentReportId();
      }
    }
    
    setLoading(false);
    return success;
  };

  return {
    // State
    reportData,
    companies,
    reports,
    currentCompany,
    currentReport,
    loading,
    // Methods
    updateReportData,
    resetReportData,
    loadCompanies,
    handleCreateCompany,
    handleCreateReport,
    loadReports,
    loadReport,
    handleDeleteReport,
    setCurrentCompany,
    setCurrentReport,
    saveSubsidiaries,
    saveCurrentReport
  };
};
