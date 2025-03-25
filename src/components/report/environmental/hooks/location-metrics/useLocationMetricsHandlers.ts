
import { useState, useCallback } from 'react';
import { LocationEnvironmentalMetrics } from './types';
import { EnvironmentalMetrics } from '@/context/types';
import { useLocationData } from './useLocationData';

export const useLocationMetricsHandlers = (reportId: string) => {
  const {
    locations,
    setLocations,
    saveLocations,
    isLoading,
    environmentalMetrics,
    setEnvironmentalMetrics,
    selectedLocationId,
    setSelectedLocationId,
    hasMultipleLocations
  } = useLocationData(reportId);

  // Add a new location
  const addLocation = useCallback((location: Omit<LocationEnvironmentalMetrics, 'metrics'>) => {
    const newLocation: LocationEnvironmentalMetrics = {
      ...location,
      metrics: {}
    };
    
    setLocations(prev => [...prev, newLocation]);
    setSelectedLocationId(location.locationId);
  }, [setLocations, setSelectedLocationId]);

  // Remove a location
  const removeLocation = useCallback((locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.locationId !== locationId));
    
    if (selectedLocationId === locationId) {
      setSelectedLocationId(null);
    }
  }, [selectedLocationId, setLocations, setSelectedLocationId]);

  // Update a metric for a specific location
  const updateLocationMetric = useCallback((locationId: string, metricKey: string, value: any) => {
    setLocations(prev => 
      prev.map(loc => {
        if (loc.locationId === locationId) {
          return {
            ...loc,
            metrics: {
              ...loc.metrics,
              [metricKey]: value
            }
          };
        }
        return loc;
      })
    );
  }, [setLocations]);

  // Get a location by ID
  const getLocationById = useCallback((locationId: string) => {
    return locations.find(loc => loc.locationId === locationId);
  }, [locations]);

  // Get metrics for the current location
  const getCurrentLocationMetrics = useCallback(() => {
    if (!selectedLocationId) return {};
    
    const currentLocation = getLocationById(selectedLocationId);
    return currentLocation?.metrics || {};
  }, [getLocationById, selectedLocationId]);

  // Handle metric change for the current location
  const handleLocationMetricsChange = useCallback((metricKey: string, value: any) => {
    if (!selectedLocationId) return;
    
    updateLocationMetric(selectedLocationId, metricKey, value);
  }, [selectedLocationId, updateLocationMetric]);

  return {
    locations,
    setLocations,
    currentLocationId: selectedLocationId,
    setCurrentLocationId: setSelectedLocationId,
    addLocation,
    removeLocation,
    updateLocationMetric,
    getLocationById,
    saveLocations,
    environmentalMetrics,
    setEnvironmentalMetrics,
    isLoading,
    hasMultipleLocations,
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  };
};
