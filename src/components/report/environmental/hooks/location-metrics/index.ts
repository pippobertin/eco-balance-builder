
import { useLocationData, formatLocationName } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';
import { LocationEnvironmentalMetrics, LocationMetricsHook } from './types';

export const useLocationMetrics = (
  companyId: string | undefined, 
  formValues: any, 
  setFormValues: React.Dispatch<React.SetStateAction<any>>
): LocationMetricsHook => {
  // Get location data
  const {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId
  } = useLocationData(companyId, formValues, setFormValues);
  
  // Get location metrics handlers
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

// Export types
export * from './types';

// Export formatLocationName so it can be used in LocationSelector.tsx
export { formatLocationName };
