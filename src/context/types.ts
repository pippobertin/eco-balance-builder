
import { MaterialityIssue, Stakeholder } from '@/components/report/materiality/types';

// Define interfaces for companies and reports
export interface Company {
  id: string;
  name: string;
  vat_number?: string;
  country?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  created_by?: string;
}

export interface Report {
  id: string;
  company_id: string;
  report_year: string;
  report_type: string; // A, B, C, D
  is_consolidated: boolean;
  environmental_metrics: any;
  social_metrics: any;
  conduct_metrics: any;
  narrative_pat_metrics?: any;
  materiality_analysis?: any;
  status: string; // draft, published
  created_at?: string;
  updated_at?: string;
}

export interface Subsidiary {
  id?: string;
  report_id?: string;
  name: string;
  location: string;
}

// Define the structure of report data
export interface ReportData {
  environmentalMetrics: {
    carbonEmissions?: number;
    energyConsumption?: number;
    wasteGeneration?: number;
    waterUsage?: number;
    renewableEnergy?: number;
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number;
    totalScope2Emissions?: number;
    totalScope3Emissions?: number;
  };
  socialMetrics: {
    employeeDiversity?: number;
    trainingHours?: number;
    communityEngagement?: number;
    employeeSatisfaction?: number;
  };
  conductMetrics: {
    governanceCompliance?: number;
    policyAdherence?: number;
    riskManagement?: number;
  };
  materialityAnalysis: {
    issues?: MaterialityIssue[];
    stakeholders?: Stakeholder[];
    esgScore?: number;
  };
  narrativePATMetrics?: any;
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
}

// Default empty report data
export const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
};
