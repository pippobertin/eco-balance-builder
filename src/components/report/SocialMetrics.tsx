
import React, { useEffect, useRef } from 'react';
import WorkforceGeneral from './social/WorkforceGeneral';
import WorkforceSafety from './social/WorkforceSafety';
import WorkforceCompensation from './social/WorkforceCompensation';
import SupplyChainMetrics from './social/SupplyChainMetrics';

interface SocialMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const SocialMetrics: React.FC<SocialMetricsProps> = ({
  formValues,
  setFormValues,
  initialField
}) => {
  const workforceGeneralRef = useRef<HTMLDivElement>(null);
  const workforceSafetyRef = useRef<HTMLDivElement>(null);
  const workforceCompensationRef = useRef<HTMLDivElement>(null);
  const supplyChainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialField) {
      if (initialField === 'workforce' && workforceGeneralRef.current) {
        workforceGeneralRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'safety' && workforceSafetyRef.current) {
        workforceSafetyRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'compensation' && workforceCompensationRef.current) {
        workforceCompensationRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (initialField === 'supplyChain' && supplyChainRef.current) {
        supplyChainRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({
      ...prev,
      socialMetrics: {
        ...prev.socialMetrics,
        [name]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Metriche Base - Questioni Sociali</h2>
      
      <WorkforceGeneral
        ref={workforceGeneralRef}
        formValues={formValues}
        handleChange={handleChange}
      />
      
      <WorkforceSafety
        ref={workforceSafetyRef}
        formValues={formValues}
        handleChange={handleChange}
      />
      
      <WorkforceCompensation
        ref={workforceCompensationRef}
        formValues={formValues}
        handleChange={handleChange}
      />
      
      <SupplyChainMetrics
        ref={supplyChainRef}
        formValues={formValues}
        handleChange={handleChange}
      />
    </div>
  );
};

export default SocialMetrics;
