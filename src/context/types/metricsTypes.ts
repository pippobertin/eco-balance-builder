
export interface DefaultMetricsState {
  [key: string]: any;
}

// Environmental metrics
export interface LocationEnvironmentalMetrics {
  id: string;
  location_id: string;
  name: string;
  locationType: string;
  metrics: Record<string, any>;
}

export interface EnvironmentalMetrics extends DefaultMetricsState {
  locationMetrics?: LocationEnvironmentalMetrics[];
}

// Social metrics
export interface SocialMetrics extends DefaultMetricsState {
  workforceDistribution?: any;
}

// Conduct metrics
export interface ConductMetrics extends DefaultMetricsState {
  antiCorruption?: any;
}

// Narrative PAT metrics
export interface NarrativePATMetrics extends DefaultMetricsState {
  strategySection?: any;
}

// Business Partners metrics
export interface BusinessPartnersMetrics extends DefaultMetricsState {
  bp1?: any;
  bp2?: any;
  bp3?: any;
  bp4?: any;
  bp5?: any;
  bp6?: any;
  bp7?: any;
  bp8?: any;
  bp9?: any;
  bp10?: any;
  bp11?: any;
}

// Materiality Analysis
export interface MaterialityIssue {
  id?: string;
  name: string;
  description?: string;
  impact_relevance?: number;
  financial_relevance?: number;
  stakeholder_relevance?: number;
  is_material?: boolean;
}

export interface Stakeholder {
  id?: string;
  name: string;
  category?: string;
  influence?: number;
  interest?: number;
  priority?: string;
  contact_info?: string;
  email?: string;
  notes?: string;
}

export interface MaterialityAnalysis extends DefaultMetricsState {
  issues: MaterialityIssue[];
  stakeholders: Stakeholder[];
}

// Complete Report Data
export interface ReportData {
  environmentalMetrics: EnvironmentalMetrics;
  socialMetrics: SocialMetrics;
  conductMetrics: ConductMetrics;
  materialityAnalysis: MaterialityAnalysis;
  narrativePATMetrics: NarrativePATMetrics;
  businessPartnersMetrics?: BusinessPartnersMetrics;
}

export const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  materialityAnalysis: { issues: [], stakeholders: [] },
  narrativePATMetrics: {}
};
