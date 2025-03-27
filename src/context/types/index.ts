
// Re-export all types from various type files
export * from './companyTypes';
export * from './reportTypes';
export * from './metricsTypes';

// Define the Subsidiary type in both locations for backwards compatibility
export interface Subsidiary {
  id?: string;
  name: string;
  location: string;
  report_id?: string;
  created_at?: string;
}

// Export the default report data
export { defaultReportData } from './metricsTypes';
