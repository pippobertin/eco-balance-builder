
import { CompanyLocation } from '@/components/report/company-information/CompanyGeneralInfo';
import { LocationEnvironmentalMetrics } from '@/context/types';

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
