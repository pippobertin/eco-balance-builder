
import { useEffect } from 'react';
import { Company, Report, ReportData } from '@/context/types';
import { localStorageUtils } from '../localStorageUtils';

export const useLocalStorageSync = (
  loadCompanyById: (companyId: string) => Promise<Company | null>,
  loadReport: (reportId: string) => Promise<{report: Report | null, subsidiaries?: any[]}>,
  loadReports: (companyId: string) => Promise<Report[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  setReportData: React.Dispatch<React.SetStateAction<ReportData>>
) => {
  // Restore current company and report from localStorage
  useEffect(() => {
    try {
      const savedCompanyId = localStorageUtils.getCurrentCompanyId();
      const savedReportId = localStorageUtils.getCurrentReportId();
      
      if (savedCompanyId && savedReportId) {
        // Load current company and report on initial load
        const loadCurrentData = async () => {
          setLoading(true);
          
          // Load company
          const companyData = await loadCompanyById(savedCompanyId);
          
          if (companyData) {
            setCurrentCompany(companyData);
            
            // Load report
            const { report, subsidiaries } = await loadReport(savedReportId);
            
            if (report) {
              setCurrentReport(report as Report);
              
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
};
