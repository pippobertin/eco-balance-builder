
import React from 'react';

interface SocialMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const SocialMetrics: React.FC<SocialMetricsProps> = ({ formValues, setFormValues, initialField }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Modulo Sociale</h2>
      <p>Questa sezione contiene indicatori sociali.</p>
    </div>
  );
};

export default SocialMetrics;
