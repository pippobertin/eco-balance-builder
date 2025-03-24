
import { useState } from 'react';
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
    setEnvironmentalMetrics
  } = useLocationData(reportId);
  
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);

  // Add a new location
  const addLocation = (location: Omit<LocationEnvironmentalMetrics, 'metrics'>) => {
    const newLocation: LocationEnvironmentalMetrics = {
      ...location,
      metrics: {}
    };
    
    setLocations(prev => [...prev, newLocation]);
    setCurrentLocationId(location.locationId);
  };

  // Remove a location
  const removeLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.locationId !== locationId));
    
    if (currentLocationId === locationId) {
      setCurrentLocationId(null);
    }
  };

  // Update a metric for a specific location
  const updateLocationMetric = (locationId: string, metricKey: string, value: any) => {
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
  };

  // Get a location by ID
  const getLocationById = (locationId: string) => {
    return locations.find(loc => loc.locationId === locationId);
  };

  return {
    locations,
    setLocations,
    currentLocationId,
    setCurrentLocationId,
    addLocation,
    removeLocation,
    updateLocationMetric,
    getLocationById,
    saveLocations,
    environmentalMetrics,
    setEnvironmentalMetrics,
    isLoading
  };
};
