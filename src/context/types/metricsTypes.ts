// Define MaterialityAnalysis structure
export interface MaterialityAnalysis {
  issues: any[];
  stakeholders: any[];
  totalScore?: number; // Add this property to fix the error
  // Other properties
}

// Define the ReportData structure
export interface ReportData {
  environmentalMetrics?: any;
  socialMetrics?: any;
  conductMetrics?: any;
  narrativePATMetrics?: any;
  materialityAnalysis?: MaterialityAnalysis;
  businessPartnersMetrics?: any;
  // Other properties
}

// Export default empty data
export const defaultReportData: ReportData = {
  environmentalMetrics: {},
  socialMetrics: {},
  conductMetrics: {},
  narrativePATMetrics: {},
  materialityAnalysis: { issues: [], stakeholders: [], totalScore: 0 },
  businessPartnersMetrics: {}
};
