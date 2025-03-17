
import React, { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import EmissionsEnergySection from './environmental/EmissionsEnergySection';
import PollutionSection from './environmental/PollutionSection';
import BiodiversitySection from './environmental/BiodiversitySection';
import WaterSection from './environmental/WaterSection';
import ResourcesSection from './environmental/ResourcesSection';
import LocationSelector from './environmental/components/LocationSelector';
import { useLocationMetrics } from './environmental/hooks/useLocationMetrics';
import { useReport } from '@/context/ReportContext';

interface EnvironmentalMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const EnvironmentalMetrics: React.FC<EnvironmentalMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  // Add refs for scrolling to specific sections
  const emissionsRef = useRef<HTMLDivElement>(null);
  const pollutionRef = useRef<HTMLDivElement>(null);
  const biodiversityRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  
  // Get current company
  const { currentCompany } = useReport();
  
  // Use location metrics hook
  const {
    locations,
    hasMultipleLocations,
    isLoading,
    selectedLocationId,
    setSelectedLocationId,
    getCurrentLocationMetrics,
    handleLocationMetricsChange
  } = useLocationMetrics(currentCompany?.id, formValues, setFormValues);

  useEffect(() => {
    // Scroll to the initial field if provided
    if (initialField) {
      if (initialField === 'emissions' && emissionsRef.current) {
        emissionsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'pollution' && pollutionRef.current) {
        pollutionRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'biodiversity' && biodiversityRef.current) {
        biodiversityRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'water' && waterRef.current) {
        waterRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'waste' && resourcesRef.current) {
        resourcesRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);
  
  // Get the appropriate metrics data and change handler based on whether we're using location-specific metrics
  const getMetricsProps = () => {
    if (hasMultipleLocations && selectedLocationId) {
      // Return location-specific metrics and handler
      return {
        metricsData: getCurrentLocationMetrics(),
        handleChange: handleLocationMetricsChange
      };
    } else {
      // Return global metrics and handler
      return {
        metricsData: formValues.environmentalMetrics,
        handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormValues((prev: any) => ({
            ...prev,
            environmentalMetrics: {
              ...prev.environmentalMetrics,
              [name]: value
            }
          }));
        }
      };
    }
  };
  
  const { metricsData, handleChange } = getMetricsProps();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Ambiente</h2>
      
      {/* Location selector - only show if the company has multiple locations */}
      {hasMultipleLocations && (
        <LocationSelector
          locations={locations}
          selectedLocationId={selectedLocationId}
          onLocationChange={setSelectedLocationId}
          isLoading={isLoading}
        />
      )}
      
      {/* Emissions & Energy Section - B3 */}
      <div ref={emissionsRef}>
        <EmissionsEnergySection formValues={{ environmentalMetrics: metricsData }} setFormValues={handleChange} />
      </div>
      
      {/* Pollution Section - B4 */}
      <div ref={pollutionRef}>
        <PollutionSection formValues={{ environmentalMetrics: metricsData }} setFormValues={handleChange} />
      </div>
      
      {/* Biodiversity Section - B5 */}
      <div ref={biodiversityRef}>
        <BiodiversitySection formValues={{ environmentalMetrics: metricsData }} setFormValues={handleChange} />
      </div>
      
      {/* Water Section - B6 */}
      <div ref={waterRef}>
        <WaterSection formValues={{ environmentalMetrics: metricsData }} setFormValues={handleChange} />
      </div>
      
      {/* Resources & Circular Economy Section - B7 */}
      <div ref={resourcesRef}>
        <ResourcesSection formValues={{ environmentalMetrics: metricsData }} setFormValues={handleChange} />
      </div>
    </div>
  );
};

export default EnvironmentalMetrics;
