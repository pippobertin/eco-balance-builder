// Re-export all types from the new structure
export * from './types/index';

export interface ReportContextType {
  reportData: ReportData;
  companies: Company[];
  reports: Report[];
  currentCompany: Company | null;
  currentReport: Report | null;
  updateReportData: (data: Partial<ReportData>) => void;
  resetReportData: () => void;
  loadCompanies: () => Promise<void>;
  createCompany: (companyData: Partial<Company>) => Promise<Company | null>;
  createReport: (reportData: Partial<Report>) => Promise<Report | null>;
  loadReports: (companyId: string) => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<boolean>;
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>;
  saveSubsidiaries: (subsidiaries: Subsidiary[], reportId?: string) => Promise<void>;
  saveCurrentReport: () => Promise<void>;
  needsSaving: boolean;
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
}
