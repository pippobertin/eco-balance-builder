
import React from 'react';

interface ConductMetricsProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  initialField?: string;
}

const ConductMetrics: React.FC<ConductMetricsProps> = ({ formValues, setFormValues, initialField }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Modulo Condotta</h2>
      <p>Questa sezione contiene indicatori di condotta aziendale.</p>
    </div>
  );
};

export default ConductMetrics;
