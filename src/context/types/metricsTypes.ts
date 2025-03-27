
import { BP1FormData, BP2FormData, BP3FormData, BP4FormData, BP5FormData, BP6FormData, BP7FormData, BP8FormData, BP9FormData, BP10FormData, BP11FormData } from '@/components/report/business-partners/hooks/types';
import { PollutionRecord } from '@/components/report/environmental/hooks/pollution/types';

// Environmental metrics
export interface LocationEnvironmentalMetrics {
  id: string;
  name: string;
  address?: string;
  location_id?: string; // Added to match database schema
  location_name?: string; // Added to match database schema
  location_type?: string; // Added to match database schema
  metrics: Record<string, any>;
}

export interface EnvironmentalMetrics {
  // GHG Emissions
  totalScope1Emissions?: number;
  totalScope2Emissions?: number;
  totalScope3Emissions?: number;
  totalScopeEmissions?: number;
  emissionCalculationLogs?: any;
  
  // Pollution
  pollutionRecords?: PollutionRecord[];
  
  // Water
  waterUsage?: number;
  waterConsumption?: number;
  waterStressAreas?: number;
  
  // Land use and biodiversity
  landUse?: number;
  impermeableSurface?: number;
  natureSurfaceOnSite?: number;
  natureSurfaceOffSite?: number;
  
  // Waste
  totalWaste?: number;
  recycledWaste?: number;
  hazardousWaste?: number;
  
  // Circular economy
  recycledContent?: number;
  recyclableContent?: number;
  
  // Location-specific metrics
  locationMetrics?: LocationEnvironmentalMetrics[];
  
  [key: string]: any;
}

// Social metrics
export interface SocialMetrics {
  [key: string]: any;
}

// Conduct metrics
export interface ConductMetrics {
  [key: string]: any;
}

// Narrative PAT metrics
export interface NarrativePATMetrics {
  [key: string]: any;
}

// Business Partners metrics
export interface BusinessPartnersMetrics {
  bp1?: BP1FormData;
  bp2?: BP2FormData;
  bp3?: BP3FormData;
  bp4?: BP4FormData;
  bp5?: BP5FormData;
  bp6?: BP6FormData;
  bp7?: BP7FormData;
  bp8?: BP8FormData;
  bp9?: BP9FormData;
  bp10?: BP10FormData;
  bp11?: BP11FormData;
  [key: string]: any;
}

// Materiality analysis
export interface StakeholderData {
  id: string;
  name: string;
  category: string;
  influence: number;
  interest: number;
  contact?: string;
  email?: string;
  notes?: string;
}

export interface MaterialityIssue {
  id: string;
  name: string;
  description?: string;
  isCustom?: boolean;
  category?: string;
  subcategory?: string;
  financialRelevance: number;
  impactRelevance: number;
  stakeholderRelevance: number;
  isMaterial: boolean;
  isSelected?: boolean;
}

export interface MaterialityAnalysis {
  issues: MaterialityIssue[];
  stakeholders: StakeholderData[];
  esgScore?: number; // ESG score field
  [key: string]: any;
}

// Combined Report Data
export interface ReportData {
  environmentalMetrics: EnvironmentalMetrics;
  socialMetrics: SocialMetrics;
  conductMetrics: ConductMetrics;
  narrativePATMetrics: NarrativePATMetrics;
  businessPartnersMetrics?: BusinessPartnersMetrics;
  materialityAnalysis: MaterialityAnalysis;
  [key: string]: any;
}

// Default state
export const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  narrativePATMetrics: {},
  businessPartnersMetrics: {},
  materialityAnalysis: {
    issues: [],
    stakeholders: []
  }
};
