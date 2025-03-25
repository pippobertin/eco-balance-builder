
import React from 'react';

interface NarrativePATMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const NarrativePATMetrics: React.FC<NarrativePATMetricsProps> = ({ formValues, setFormValues, initialField }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Modulo Narrativa PAT</h2>
      <p>Questa sezione contiene indicatori narrativi.</p>
    </div>
  );
};

export default NarrativePATMetrics;
