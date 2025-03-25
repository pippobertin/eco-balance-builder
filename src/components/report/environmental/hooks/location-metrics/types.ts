
import { Dispatch, SetStateAction } from 'react';
import { EnvironmentalMetrics } from '@/context/types';

// Define LocationEnvironmentalMetrics locally here
export interface LocationEnvironmentalMetrics {
  locationId: string;
  locationName: string;
  locationType?: string;
  metrics: Record<string, any>;
}

export interface LocationMetricsState {
  locations: LocationEnvironmentalMetrics[];
  setLocations: Dispatch<SetStateAction<LocationEnvironmentalMetrics[]>>;
  currentLocationId: string | null;
  setCurrentLocationId: Dispatch<SetStateAction<string | null>>;
  addLocation: (location: Omit<LocationEnvironmentalMetrics, 'metrics'>) => void;
  removeLocation: (locationId: string) => void;
  updateLocationMetric: (locationId: string, metricKey: string, value: any) => void;
  getLocationById: (locationId: string) => LocationEnvironmentalMetrics | undefined;
  saveLocations: () => Promise<boolean>;
  environmentalMetrics: EnvironmentalMetrics;
  setEnvironmentalMetrics: Dispatch<SetStateAction<EnvironmentalMetrics>>;
  isLoading: boolean;
}
