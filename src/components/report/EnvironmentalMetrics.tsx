
import React, { useEffect, useRef } from 'react';
import { Leaf } from 'lucide-react';
import EmissionsEnergySection from './environmental/EmissionsEnergySection';
import WaterSection from './environmental/WaterSection';
import ResourcesSection from './environmental/ResourcesSection';
import BiodiversitySection from './environmental/BiodiversitySection';
import PollutionSection from './environmental/PollutionSection';

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
  const emissionsRef = useRef<HTMLDivElement>(null);
  const waterRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const biodiversityRef = useRef<HTMLDivElement>(null);
  const pollutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialField) {
      if (initialField === 'emissions' && emissionsRef.current) {
        emissionsRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'water' && waterRef.current) {
        waterRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'resources' && resourcesRef.current) {
        resourcesRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'biodiversity' && biodiversityRef.current) {
        biodiversityRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'pollution' && pollutionRef.current) {
        pollutionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      environmentalMetrics: {
        ...prev.environmentalMetrics,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Questioni Ambientali</h2>
      
      {/* B3 - Emissioni e Energia */}
      <div ref={emissionsRef}>
        <EmissionsEnergySection
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
      
      {/* B4 - Risorse */}
      <div ref={resourcesRef}>
        <ResourcesSection
          formValues={formValues}
          setFormValues={handleChange}
        />
      </div>
      
      {/* B5 - Acqua */}
      <div ref={waterRef}>
        <WaterSection
          formValues={formValues}
          setFormValues={handleChange}
        />
      </div>
      
      {/* B6 - Biodiversità */}
      <div ref={biodiversityRef}>
        <BiodiversitySection
          formValues={formValues}
          setFormValues={handleChange}
        />
      </div>
      
      {/* B7 - Inquinamento */}
      <div ref={pollutionRef}>
        <PollutionSection
          formValues={formValues}
          setFormValues={handleChange}
        />
      </div>
    </div>
  );
};

export default EnvironmentalMetrics;
