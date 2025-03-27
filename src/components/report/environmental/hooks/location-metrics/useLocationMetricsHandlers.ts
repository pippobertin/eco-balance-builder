import { useState } from 'react';
import { useReport } from '@/hooks/use-report-context';
import { LocationEnvironmentalMetrics } from '@/context/types';

export const useLocationMetricsHandlers = (setLocations: React.Dispatch<React.SetStateAction<LocationEnvironmentalMetrics[]>>) => {
  const { updateReportData } = useReport();
  
  const addLocation = (name: string, locationId: string) => {
  if (!name || !locationId) return;
  
  const newLocation: LocationEnvironmentalMetrics = {
    name,
    locationId,
    location_id: locationId, // Add for backwards compatibility
    metrics: {}
  };
  
    setLocations(current => [...current, newLocation]);
  };
  
  const removeLocation = (id: string) => {
    setLocations(current => current.filter(location => location.id !== id));
  };
  
  const updateLocation = (id: string, data: Partial<LocationEnvironmentalMetrics>) => {
    setLocations(current => 
      current.map(location => {
        if (location.id === id) {
          // If updating locationId, also update location_id for backward compatibility
          if (data.locationId) {
            data.location_id = data.locationId;
          }
          return { ...location, ...data };
        }
        return location;
      })
    );
  };
  
  const updateLocationMetrics = (id: string, metricName: string, value: number | string | null) => {
    setLocations(current => 
      current.map(location => {
        if (location.id === id) {
          // Ensure metrics object exists
          const existingMetrics = location.metrics || {};
          
          // Create updated metrics with the new value
          const updatedMetrics = {
            ...existingMetrics,
            [metricName]: value
          };
          
          // Return the updated location
          return {
            ...location,
            metrics: updatedMetrics
          };
        }
        return location;
      })
    );
  };

  return {
    addLocation,
    removeLocation,
    updateLocation,
    updateLocationMetrics
  };
};
