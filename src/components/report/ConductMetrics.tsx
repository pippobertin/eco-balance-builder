
import React, { useEffect, useRef } from 'react';
import AntiCorruptionMetrics from './conduct/AntiCorruptionMetrics';
import ComplianceMetrics from './conduct/ComplianceMetrics';

interface ConductMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const ConductMetrics: React.FC<ConductMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  const antiCorruptionRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialField) {
      if (initialField === 'antiCorruption' && antiCorruptionRef.current) {
        antiCorruptionRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'compliance' && complianceRef.current) {
        complianceRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      conductMetrics: {
        ...prev.conductMetrics,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Condotta delle Imprese</h2>
      
      <div ref={antiCorruptionRef}>
        <AntiCorruptionMetrics
          formValues={formValues}
          handleChange={handleChange}
        />
      </div>
      
      <div ref={complianceRef}>
        <ComplianceMetrics
          formValues={formValues}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ConductMetrics;
