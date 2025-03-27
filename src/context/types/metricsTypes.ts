
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
}

export interface EnvironmentalMetrics {
  energyConsumption?: number;
  waterUsage?: number;
  wasteGeneration?: number;
  greenhouseEmissions?: number;
  locations?: LocationEnvironmentalMetrics[];
}

export interface LocationEnvironmentalMetrics {
  id?: string;
  name: string;
  locationId: string;
  energyConsumption?: number;
  waterUsage?: number;
  wasteGeneration?: number;
  greenhouseEmissions?: number;
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
  businessPartnersMetrics: {}
};
