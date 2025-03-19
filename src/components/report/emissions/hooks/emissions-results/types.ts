
import { EmissionCalculationLogs } from '@/hooks/emissions-calculator/types';

export interface EmissionsResults {
  scope1Emissions: number;
  scope2Emissions: number;
  scope3Emissions: number;
  totalEmissions: number;
  isLoading: boolean;
  isSaving: boolean;
}

export interface EmissionsData {
  report_id: string; // Changed from optional to required
  scope1_emissions: number;
  scope2_emissions: number;
  scope3_emissions: number;
  total_emissions: number;
  updated_at?: string;
}
