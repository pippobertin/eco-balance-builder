
// Re-export all types from the new structure
export * from './types/index';

export interface ReportContextType {
  reportData: import('./types').ReportData;
  companies: import('./types').Company[];
  reports: import('./types').Report[];
  currentCompany: import('./types').Company | null;
  currentReport: import('./types').Report | null;
  updateReportData: (data: Partial<import('./types').ReportData>) => void;
  resetReportData: () => void;
  loadCompanies: () => Promise<void>;
  createCompany: (companyData: Partial<import('./types').Company>) => Promise<import('./types').Company | null>;
  createReport: (reportData: Partial<import('./types').Report>) => Promise<import('./types').Report | null>;
  loadReports: (companyId: string) => Promise<import('./types').Report[]>;
  loadReport: (reportId: string) => Promise<{ report: import('./types').Report | null, subsidiaries?: import('./types').Subsidiary[] }>;
  deleteReport: (reportId: string) => Promise<boolean>;
  setCurrentCompany: React.Dispatch<React.SetStateAction<import('./types').Company | null>>;
  setCurrentReport: React.Dispatch<React.SetStateAction<import('./types').Report | null>>;
  saveSubsidiaries: (subsidiaries: import('./types').Subsidiary[], reportId?: string) => Promise<void>;
  saveCurrentReport: () => Promise<void>;
  needsSaving: boolean;
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
}
