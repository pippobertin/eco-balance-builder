import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Company, Report } from './types';
import { useCompanyOperations } from './companyOperations';
import { useReportReadOperations } from './report/reportReadOperations';
import { useReportWriteOperations } from './report/reportWriteOperations';
import { useAuth } from './AuthContext';
import { localStorageUtils } from './report/localStorageUtils';
import { useReportEntityState } from './reportEntityState';

interface ReportContextType {
  companies: Company[];
  reports: Report[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
  currentReport: Report | null;
  setCurrentReport: (report: Report | null) => void;
  loadCompanies: () => Promise<void>;
  loadReports: (companyId: string) => Promise<void>;
  createCompany: (company: Omit<Company, 'id'>) => Promise<string | null>;
  deleteReport: (reportId: string) => Promise<boolean>;
  createReport: (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  isLoading: boolean;
  isAdmin: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  children: React.ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { loadCompanies: loadCompaniesFromApi, createCompany: createCompanyInApi } = useCompanyOperations();
  const { loadReports: loadReportsFromApi } = useReportReadOperations();
  const { deleteReport: deleteReportInApi, createReport: createReportInApi } = useReportWriteOperations();
  const {
    companies,
    setCompanies,
    reports,
    setReports,
    currentCompany,
    setCurrentCompany,
    currentReport,
    setCurrentReport,
    loading,
    setLoading
  } = useReportEntityState();

  // Load companies
  const loadCompanies = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const companies = await loadCompaniesFromApi();
      setCompanies(companies);
    } catch (error) {
      console.error("Failed to load companies", error);
    } finally {
      setLoading(false);
    }
  }, [loadCompaniesFromApi, setCompanies, setLoading, user]);

  // Load reports for a company
  const loadReports = useCallback(async (companyId: string) => {
    setLoading(true);
    try {
      const reports = await loadReportsFromApi(companyId);
      setReports(reports);
    } catch (error) {
      console.error("Failed to load reports", error);
    } finally {
      setLoading(false);
    }
  }, [loadReportsFromApi, setReports, setLoading]);

  // Create a new company
  const createCompany = useCallback(async (company: Omit<Company, 'id'>): Promise<string | null> => {
    try {
      return await createCompanyInApi(company);
    } catch (error) {
      console.error("Failed to create company", error);
      return null;
    }
  }, [createCompanyInApi]);

  // Delete a report
  const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
    try {
      return await deleteReportInApi(reportId);
    } catch (error) {
      console.error("Failed to delete report", error);
      return false;
    }
  }, [deleteReportInApi]);

  // Create a new report
  const createReport = useCallback(async (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> => {
    try {
      return await createReportInApi(report);
    } catch (error) {
      console.error("Failed to create report", error);
      return null;
    }
  }, [createReportInApi]);

  useEffect(() => {
    if (user) {
      loadCompanies();
      
      const storedCompanyId = localStorageUtils.getCurrentCompanyId();
      if (storedCompanyId) {
        // Try to find the company in the loaded companies
        const storedCompany = companies.find(c => c.id === storedCompanyId);
        if (storedCompany) {
          setCurrentCompany(storedCompany);
        } else {
          // If not found, clear the stored company ID
          localStorageUtils.removeCurrentCompanyId();
        }
      }
      
      const storedReportId = localStorageUtils.getCurrentReportId();
       if (storedReportId) {
        // Try to find the report in the loaded reports
        // You might need to load reports here if they are not already loaded
        // For now, let's assume reports are loaded elsewhere when a company is selected
        // const storedReport = reports.find(r => r.id === storedReportId);
        // if (storedReport) {
        //   setCurrentReport(storedReport);
        // } else {
          // If not found, clear the stored report ID
          localStorageUtils.removeCurrentReportId();
        // }
      }
    }
  }, [user, loadCompanies, companies, setCurrentCompany, reports, setCurrentReport]);

  const value: ReportContextType = {
    companies,
    reports,
    currentCompany,
    setCurrentCompany,
    currentReport,
    setCurrentReport,
    loadCompanies,
    loadReports,
    createCompany,
    deleteReport,
    createReport,
    isLoading: loading,
    isAdmin: isAdmin
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReport must be used within a ReportProvider");
  }
  return context;
};
