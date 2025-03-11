
import React, { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import EmissionsEnergySection from './environmental/EmissionsEnergySection';
import PollutionSection from './environmental/PollutionSection';
import BiodiversitySection from './environmental/BiodiversitySection';
import WaterSection from './environmental/WaterSection';
import ResourcesSection from './environmental/ResourcesSection';

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Ambiente</h2>
      
      {/* Emissions & Energy Section - B3 */}
      <div ref={emissionsRef}>
        <EmissionsEnergySection formValues={formValues} setFormValues={setFormValues} />
      </div>
      
      {/* Pollution Section - B4 */}
      <div ref={pollutionRef}>
        <PollutionSection formValues={formValues} setFormValues={setFormValues} />
      </div>
      
      {/* Biodiversity Section - B5 */}
      <div ref={biodiversityRef}>
        <BiodiversitySection formValues={formValues} setFormValues={setFormValues} />
      </div>
      
      {/* Water Section - B6 */}
      <div ref={waterRef}>
        <WaterSection formValues={formValues} setFormValues={setFormValues} />
      </div>
      
      {/* Resources & Circular Economy Section - B7 */}
      <div ref={resourcesRef}>
        <ResourcesSection formValues={formValues} setFormValues={setFormValues} />
      </div>
    </div>
  );
};

export default EnvironmentalMetrics;
