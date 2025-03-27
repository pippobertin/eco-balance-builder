

// Define report data interface
export interface ReportData {
  generalInfo: {
    companyName: string;
    year: string;
    reportType: string;
  };
  environmentalMetrics: EnvironmentalMetrics;
  socialMetrics: SocialMetrics;
  governanceMetrics: GovernanceMetrics;
  conductMetrics: ConductMetrics;
  businessPartnersMetrics: any;
  materialityAnalysis?: {
    issues?: any[];
    stakeholders?: any[];
    esgScore?: number;
  };
  narrativePATMetrics?: any;
}

export interface EnvironmentalMetrics {
  energyConsumption?: number;
  waterUsage?: number;
  wasteGeneration?: number;
  greenhouseEmissions?: number;
  locations?: LocationEnvironmentalMetrics[];
  
  // Additional properties used in the dashboard
  totalScope1Emissions?: number;
  totalScope2Emissions?: number;
  totalScope3Emissions?: number;
  totalScopeEmissions?: number;
  emissionCalculationLogs?: any;
  waterConsumption?: number;
  waterStressAreas?: number;
  landUse?: number;
  impermeableSurface?: number;
  natureSurfaceOnSite?: number;
  natureSurfaceOffSite?: number;
  airPollution?: number;
  waterPollution?: number;
  soilPollution?: number;
  totalWaste?: number;
  recycledWaste?: number;
  hazardousWaste?: number;
  recycledContent?: number;
  recyclableContent?: number;
  renewableEnergy?: number;
  carbonEmissions?: number;
  locationMetrics?: any[];
}

export interface LocationEnvironmentalMetrics {
  id?: string;
  name: string;
  locationId: string;
  energyConsumption?: number;
  waterUsage?: number;
  wasteGeneration?: number;
  greenhouseEmissions?: number;
  metrics?: any;
  location_id?: string; // Adding for backwards compatibility
  location_name?: string; // Adding for backwards compatibility
  location_type?: string; // Adding for backwards compatibility
}

export interface SocialMetrics {
  employeeTurnoverRate?: number;
  diversityScore?: number;
  trainingHoursPerEmployee?: number;
  healthAndSafetyIncidents?: number;
  communityInvestment?: number;
  employmentType?: {
    fullTime: number;
    partTime: number;
  };
  genderDistribution?: {
    male: number;
    female: number;
    other: number;
  };
  
  // Additional properties used in dashboard
  totalEmployees?: number;
  maleEmployees?: number;
  femaleEmployees?: number;
  otherGenderEmployees?: number;
  permanentEmployees?: number;
  temporaryEmployees?: number;
  totalEmployeesFTE?: number;
  workAccidentsNumber?: number;
  workAccidentDeaths?: number;
  workDiseaseDeaths?: number;
  entryWage?: number;
  localMinimumWage?: number;
  entryWageToMinimumWageRatio?: number;
  genderPayGap?: number;
  collectiveBargainingCoverage?: number;
  avgTrainingHoursMale?: number;
  avgTrainingHoursFemale?: number;
  employeesByCountry?: any;
  supplyChainImpactProcess?: string;
  identifiedImpacts?: string;
  employeeTurnover?: number;
  workAccidents?: number;
  employeeDiversity?: number;
  employeeSatisfaction?: number;
  trainingHours?: number;
  communityEngagement?: number;
}

export interface GovernanceMetrics {
  boardDiversity?: number;
  ethicsViolations?: number;
  complianceIncidents?: number;
  transparencyScore?: number;
}

export interface ConductMetrics {
  antiCorruptionPolicies?: boolean;
  humanRightsAssessments?: boolean;
  whistleblowerProtections?: boolean;
  dataPrivacyMeasures?: boolean;
  
  // Additional properties used in dashboard
  governanceCompliance?: number;
  codeOfConductViolations?: number;
  policyAdherence?: number;
  riskManagement?: number;
  antiCorruptionTraining?: number;
  sustainabilityCommittee?: boolean;
  antiCorruptionConvictions?: number;
  antiCorruptionSanctions?: number;
}

// Default report data
export const defaultReportData: ReportData = {
  generalInfo: {
    companyName: '',
    year: new Date().getFullYear().toString(),
    reportType: 'sustainability',
  },
  environmentalMetrics: {
    locations: []
  },
  socialMetrics: {},
  governanceMetrics: {},
  conductMetrics: {},
  businessPartnersMetrics: {},
  materialityAnalysis: { issues: [], stakeholders: [] },
  narrativePATMetrics: {}
};

