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
  sector?: string;
  ateco_code?: string;
  nace_code?: string;
  legal_form?: string;
  collective_agreement?: string;
  profile_about?: string;
  profile_values?: string;
  profile_mission?: string;
  profile_vision?: string;
  profile_value_chain?: string;
  profile_value_creation_factors?: string;
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
    energyConsumption?: number; // Total energy in MWh
    fossilFuelEnergy?: number; // Fossil fuel energy in MWh
    renewableEnergy?: number; // Renewable energy in MWh
    wasteGeneration?: number;
    waterUsage?: number; // Total water withdrawal
    waterConsumption?: number; // Water consumption (withdrawal - discharge)
    waterStressAreas?: number; // Water withdrawal in water stress areas
    scope1Data?: any;
    scope2Data?: any;
    scope3Data?: any;
    totalScope1Emissions?: number; // Scope 1 emissions in tCO2eq
    totalScope2Emissions?: number; // Scope 2 emissions in tCO2eq
    totalScope3Emissions?: number; // Scope 3 emissions in tCO2eq
    totalScopeEmissions?: number; // Total emissions
    
    // B4 - Pollution
    airPollution?: number; // Air pollutants
    waterPollution?: number; // Water pollutants
    soilPollution?: number; // Soil pollutants
    
    // B5 - Biodiversity
    landUse?: number; // Total land use in hectares
    impermeableSurface?: number; // Total impermeable surface in hectares
    natureSurfaceOnSite?: number; // Nature-oriented surface on site in hectares
    natureSurfaceOffSite?: number; // Nature-oriented surface off site in hectares
    
    // B7 - Resources & Circular Economy
    totalWaste?: number; // Total waste in kg or tons
    recycledWaste?: number; // Recycled waste in kg or tons
    hazardousWaste?: number; // Hazardous waste in kg or tons
    recycledContent?: number; // Recycled content in products (%)
    recyclableContent?: number; // Recyclable content in products (%)
  };
  socialMetrics: {
    employeeDiversity?: number;
    trainingHours?: number;
    communityEngagement?: number;
    employeeSatisfaction?: number;
    genderRatio?: number;
    permanentEmployeePercentage?: number;
    maleEmployees?: number;
    femaleEmployees?: number;
    otherGenderEmployees?: number;
    totalEmployees?: number;
    permanentEmployees?: number;
    temporaryEmployees?: number;
    fullTimeEmployees?: number;
    partTimeEmployees?: number;
    avgTrainingHoursMale?: number;
    avgTrainingHoursFemale?: number;
    employeesByCountry?: string;
    workAccidentsNumber?: number; // Number of recordable work accidents
    totalHoursWorked?: number;
    workAccidentsRate?: number;
    workAccidentDeaths?: number; // Deaths due to work accidents
    workDiseaseDeaths?: number; // Deaths due to occupational diseases
    entryWage?: number; // Entry wage
    localMinimumWage?: number; // Local minimum wage
    entryWageToMinimumWageRatio?: number; // Ratio of entry wage to minimum wage
    genderPayGap?: number; // Gender pay gap (%)
    collectiveBargainingCoverage?: number; // Collective bargaining coverage (%)
    totalEmployeesFTE?: number; // Total employees in FTE
    supplyChainImpactProcess?: string; // Process to identify supply chain impacts
    identifiedImpacts?: string; // Identified impacts in supply chain
    employeeTurnover?: number;
    workAccidents?: number;
  };
  conductMetrics: {
    governanceCompliance?: number;
    policyAdherence?: number;
    riskManagement?: number;
    codeOfConductViolations?: number;
    antiCorruptionTraining?: number;
    boardDiversity?: number;
    executivePayRatio?: number;
    sustainabilityCommittee?: number;
    antiCorruptionConvictions?: number; // Number of convictions for corruption (B12)
    antiCorruptionSanctions?: number; // Amount of sanctions paid for corruption (B12)
  };
  businessPartnersMetrics?: {
    totalSuppliers?: number;
    localSuppliers?: number;
    internationalSuppliers?: number;
    certifiedSuppliers?: number;
    suppliersWithEsgRating?: number;
    criticalSuppliers?: number;
    avgPaymentTime?: number;
    avgContractDuration?: number;
    positiveEsgImpactSuppliers?: number;
    negativeEsgImpactSuppliers?: number;
    totalSuppliersScreened?: number;
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
  businessPartnersMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
};
