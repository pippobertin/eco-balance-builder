
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';

export interface LocationMetricsState {
  locations: LocationEnvironmentalMetrics[];
  isLoading: boolean;
  selectedLocationId: string;
  hasMultipleLocations: boolean;
}

export interface LocationEnvironmentalMetrics {
  id?: string;
  report_id?: string;
  locationId: string;
  name: string;
  location_type?: string;
  metrics: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface LocationMetricsHandlers {
  setSelectedLocationId: (id: string) => void;
  getCurrentLocationMetrics: () => Record<string, any>;
  handleLocationMetricsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export type LocationMetricsHook = LocationMetricsState & LocationMetricsHandlers;
