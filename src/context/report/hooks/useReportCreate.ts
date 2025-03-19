
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Company, Report, Subsidiary } from '@/context/types';
import { useCompanyOperations } from '@/context/companyOperations';
import { useReportOperations } from '../reportOperations';

export const useReportCreate = (
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>,
  setReports: React.Dispatch<React.SetStateAction<Report[]>>,
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>,
  resetReportData: () => void,
  loadCompanies: () => Promise<void>,
  fetchReport: (reportId: string) => Promise<{report: Report | null, subsidiaries?: Subsidiary[]}>
) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { createCompany } = useCompanyOperations();
  const reportOps = useReportOperations();

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

  // Create report
  const handleCreateReport = async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    setLoading(true);
    const reportId = await reportOps.createReport(report);
    
    if (reportId) {
      // Load the new report data
      const { report: newReport } = await fetchReport(reportId);
      
      if (newReport) {
        setReports(prev => [...prev, newReport as Report]);
        setCurrentReport(newReport as Report);
        
        // Initialize report data
        resetReportData();
      }
    }
    
    setLoading(false);
    return reportId;
  };

  return {
    loading,
    handleCreateCompany,
    handleCreateReport,
  };
};
