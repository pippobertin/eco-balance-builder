
import React from 'react';
import MaterialityAnalysisContainer from './materiality/MaterialityAnalysisContainer';
import { useAutoSaveMateriality } from './materiality/hooks/useAutoSaveMateriality';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  // Use the auto-save hook
  useAutoSaveMateriality({
    materialityData: formValues?.materialityAnalysis
  });

  return (
    <MaterialityAnalysisContainer 
      formValues={formValues} 
      setFormValues={setFormValues} 
    />
  );
};

export default MaterialityAnalysis;
