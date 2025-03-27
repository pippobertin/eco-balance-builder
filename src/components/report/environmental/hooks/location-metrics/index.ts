
export * from './types';
export { useLocationData } from './useLocationData';
export { useLocationMetricsHandlers } from './useLocationMetricsHandlers';
export { formatLocationName } from './useLocationData';

// Create a convenience hook that combines both hooks
import { useLocationData } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';
import { useState } from 'react';

export const useLocationMetrics = () => {
  const {
    locations,
    isLoading,
    isSaving,
    hasMultipleLocations,
    selectedLocationId,
    setSelectedLocationId,
    loadLocations,
    addLocation,
    updateLocation,
    saveLocation
  } = useLocationData();
  
  const {
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  } = useLocationMetricsHandlers();
  
  // Create a wrapper for handleLocationMetricsChange that includes needed parameters
  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedLocations = handleLocationMetricsChange(e, locations, selectedLocationId);
    // Update the locations state
    // Since this is a convenience hook, we're not actually setting state here
    // The parent component will need to handle this
    return updatedLocations;
  };
  
  return {
    locations,
    isLoading,
    isSaving,
    hasMultipleLocations,
    selectedLocationId,
    setSelectedLocationId,
    loadLocations,
    addLocation,
    updateLocation,
    saveLocation,
    getCurrentLocationMetrics: () => getCurrentLocationMetrics(locations, selectedLocationId),
    handleLocationMetricsChange: handleMetricsChange
  };
};
