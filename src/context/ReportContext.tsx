import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Company, Report, Subsidiary, ReportContextType } from './types';
import { useCompanyOperations } from './companyOperations';
import { useReportReadOperations } from './report/reportReadOperations';
import { useReportWriteOperations } from './report/reportWriteOperations';
import { useAuth } from './AuthContext';
import { localStorageUtils } from './report/localStorageUtils';
import { useReportEntityState } from './report/reportEntityState';

export const ReportContext = createContext<ReportContextType | undefined>(undefined);

interface ReportProviderProps {
  children: React.ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const { loadCompanies: loadCompaniesFromApi, createCompany: createCompanyInApi } = useCompanyOperations();
  const { loadReports: loadReportsFromApi, loadReport: loadReportFromApi } = useReportReadOperations();
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

  const [reportData, setReportData] = useState<any>({});
  const [needsSaving, setNeedsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateReportData = (data: any) => {
    setReportData(prevData => ({ ...prevData, ...data }));
    setNeedsSaving(true);
  };

  const saveCurrentReport = async (): Promise<void> => {
    console.log("Saving current report (placeholder)");
    setNeedsSaving(false);
    setLastSaved(new Date());
  };

  const saveSubsidiaries = async (subsidiaries: any[], reportId: string): Promise<void> => {
    console.log("Saving subsidiaries (placeholder)");
    setNeedsSaving(false);
    setLastSaved(new Date());
  };

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

  const loadReports = useCallback(async (companyId: string) => {
    setLoading(true);
    try {
      const reports = await loadReportsFromApi(companyId);
      setReports(reports);
      return reports;
    } catch (error) {
      console.error("Failed to load reports", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [loadReportsFromApi, setReports, setLoading]);

  const loadReport = useCallback(async (reportId: string) => {
    setLoading(true);
    try {
      const result = await loadReportFromApi(reportId);
      return result;
    } catch (error) {
      console.error("Failed to load report", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadReportFromApi, setLoading]);

  const createCompany = useCallback(async (company: Omit<Company, 'id'>): Promise<string | null> => {
    try {
      return await createCompanyInApi(company);
    } catch (error) {
      console.error("Failed to create company", error);
      return null;
    }
  }, [createCompanyInApi]);

  const deleteReport = useCallback(async (reportId: string): Promise<boolean> => {
    try {
      return await deleteReportInApi(reportId);
    } catch (error) {
      console.error("Failed to delete report", error);
      return false;
    }
  }, [deleteReportInApi]);

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
        const storedCompany = companies.find(c => c.id === storedCompanyId);
        if (storedCompany) {
          setCurrentCompany(storedCompany);
        } else {
          localStorageUtils.removeCurrentCompanyId();
        }
      }
      
      const storedReportId = localStorageUtils.getCurrentReportId();
      if (storedReportId) {
        const storedReport = reports.find(r => r.id === storedReportId);
        if (storedReport) {
          setCurrentReport(storedReport);
        } else {
          localStorageUtils.removeCurrentReportId();
        }
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
    loadReport,
    createCompany,
    deleteReport,
    createReport,
    isLoading: loading,
    isAdmin,
    reportData,
    updateReportData,
    saveCurrentReport,
    saveSubsidiaries,
    needsSaving,
    setNeedsSaving,
    lastSaved,
    setLastSaved
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
