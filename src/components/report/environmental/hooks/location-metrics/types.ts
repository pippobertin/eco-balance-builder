
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';

export interface LocationEnvironmentalMetrics {
  id: string;
  location_id: string;
  name: string;
  locationType: string;
  metrics: Record<string, any>;
}

export interface LocationMetricsState {
  locations: CompanyLocation[];
  isLoading: boolean;
  selectedLocationId: string;
  hasMultipleLocations: boolean;
}

export interface LocationMetricsHandlers {
  setSelectedLocationId: (id: string) => void;
  getCurrentLocationMetrics: () => Record<string, any>;
  handleLocationMetricsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export type LocationMetricsHook = LocationMetricsState & LocationMetricsHandlers;
