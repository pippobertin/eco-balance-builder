
// Define report-related interfaces
export interface Report {
  id: string;
  company_id: string;
  report_year: string;
  report_type: string;
  is_consolidated: boolean;
  environmental_metrics: any;
  social_metrics: any;
  conduct_metrics: any;
  narrative_pat_metrics: any;
  materiality_analysis: any;
  status: 'draft' | 'published' | string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportData {
  environmentalMetrics: any;
  socialMetrics: any;
  conductMetrics: any;
  materialityAnalysis: {
    issues: any[];
    stakeholders: any[];
  };
  narrativePATMetrics: any;
}

export interface LocationEnvironmentalMetrics {
  id?: string;
  location_id: string;
  location_name: string;
  energy_consumption?: number;
  water_usage?: number;
  waste_production?: number;
  carbon_emissions?: number;
  report_id?: string;
}

// Default values for report data
export const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: { issues: [], stakeholders: [] },
  narrativePATMetrics: {}
};

export interface ReportContextType {
  companies: Company[];
  reports: Report[];
  currentCompany: Company | null;
  setCurrentCompany: (company: Company) => void;
  currentReport: Report | null;
  setCurrentReport: (report: Report | null) => void;
  loadCompanies: () => Promise<void>;
  loadReports: (companyId: string) => Promise<Report[]>;
  loadReport: (reportId: string) => Promise<any>;
  createCompany: (company: Omit<Company, 'id'>) => Promise<string | null>;
  deleteReport: (reportId: string) => Promise<boolean>;
  createReport: (report: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  isLoading: boolean;
  isAdmin: boolean;
  reportData: any;
  updateReportData: (data: any) => void;
  saveCurrentReport: () => Promise<void>;
  saveSubsidiaries: (subsidiaries: any[], reportId: string) => Promise<void>;
  needsSaving: boolean;
  setNeedsSaving: (needsSaving: boolean) => void;
  lastSaved: Date | null;
  setLastSaved: (lastSaved: Date | null) => void;
}
