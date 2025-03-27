
import { useCallback } from 'react';
import { LocationEnvironmentalMetrics } from './types';
import { useToast } from '@/hooks/use-toast';

export const useLocationMetricsHandlers = () => {
  const { toast } = useToast();

  // Get metrics for the currently selected location
  const getCurrentLocationMetrics = useCallback((locations: LocationEnvironmentalMetrics[], selectedId: string | null) => {
    if (!selectedId) return {};
    
    const selectedLocation = locations.find(loc => loc.locationId === selectedId);
    return selectedLocation?.metrics || {};
  }, []);

  // Handle metric change
  const handleLocationMetricsChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    locations: LocationEnvironmentalMetrics[], 
    selectedId: string | null
  ) => {
    if (!selectedId) return locations;
    
    const { name, value } = e.target;
    
    return locations.map(location => {
      if (location.locationId === selectedId) {
        return {
          ...location,
          metrics: {
            ...location.metrics,
            [name]: value
          }
        };
      }
      return location;
    });
  }, []);

  return {
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  };
};
