
import { useLocationData } from './useLocationData';
import { useLocationMetricsHandlers } from './useLocationMetricsHandlers';

export const useLocationMetrics = (
  companyId: string | undefined, 
  formValues: any, 
  setFormValues: React.Dispatch<React.SetStateAction<any>>
) => {
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
