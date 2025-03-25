
import { Company } from './companyTypes';
import { ReportData } from './metricsTypes';
import { Subsidiary } from './companyTypes';

export interface Report {
  id: string;
  company_id: string;
  company?: Company;
  report_year: string;
  report_type: string;
  is_consolidated: boolean;
  environmental_metrics: any;
  social_metrics: any;
  conduct_metrics: any;
  narrative_pat_metrics?: any;
  materiality_analysis?: any;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Context type definition
export interface ReportContextType {
  reportData: ReportData;
  updateReportData: (data: Partial<ReportData>) => void;
  resetReportData: () => void;
  companies: Company[];
  reports: Report[];
  currentCompany: Company | null;
  currentReport: Report | null;
  loadCompanies: () => Promise<void>;
  createCompany: (company: Omit<Company, 'id'>) => Promise<string | null>;
  createReport: (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  deleteReport: (reportId: string) => Promise<boolean>;
  loadReports: (companyId: string) => Promise<Report[]>;
  loadReport: (reportId: string) => Promise<{report: Report | null, subsidiaries?: Subsidiary[]}>;
  setCurrentCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  setCurrentReport: React.Dispatch<React.SetStateAction<Report | null>>;
  saveSubsidiaries: (subsidiaries: Subsidiary[], reportId: string) => Promise<void>;
  saveCurrentReport: () => Promise<void>;
  needsSaving: boolean;
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  lastSaved: Date | null;
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>;
}
