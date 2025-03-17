
import { useLocationData } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';
import { LocationMetricsHook } from './types';
import { formatLocationName } from './useLocationData';

export const useLocationMetrics = (
  companyId: string | undefined, 
  formValues: any, 
  setFormValues: React.Dispatch<React.SetStateAction<any>>
): LocationMetricsHook => {
  // Get location data and state
  const {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId
  } = useLocationData(companyId, formValues, setFormValues);

  // Get handlers for location metrics
  const {
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  } = useLocationMetricsHandlers(selectedLocationId, formValues, setFormValues);

  return {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId,
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  };
};

// Re-export the location formatter for use in other components
export { formatLocationName };
