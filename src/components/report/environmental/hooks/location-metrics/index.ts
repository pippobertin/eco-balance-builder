
export * from './types';
export { useLocationData } from './useLocationData';
export { useLocationMetricsHandlers } from './useLocationMetricsHandlers';
export { formatLocationName } from './useLocationData';

// Create a convenience hook that combines both hooks
import { useLocationData } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';

export const useLocationMetrics = () => {
  const locationData = useLocationData();
  const metricsHandlers = useLocationMetricsHandlers();
  
  return {
    ...locationData,
    ...metricsHandlers
  };
};
