
import { useLocationData, formatLocationName } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';

export const useLocationMetrics = (reportId: string) => {
  // Get location data and handlers
  const locationHandlers = useLocationMetricsHandlers(reportId);
  
  return {
    locations: locationHandlers.locations,
    hasMultipleLocations: locationHandlers.hasMultipleLocations,
    isLoading: locationHandlers.isLoading,
    selectedLocationId: locationHandlers.currentLocationId,
    setSelectedLocationId: locationHandlers.setCurrentLocationId,
    getCurrentLocationMetrics: locationHandlers.getCurrentLocationMetrics,
    handleLocationMetricsChange: locationHandlers.handleLocationMetricsChange,
    saveLocations: locationHandlers.saveLocations
  };
};

// Export formatLocationName so it can be used in LocationSelector.tsx
export { formatLocationName };
