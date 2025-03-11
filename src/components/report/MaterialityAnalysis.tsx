
import React from 'react';
import MaterialityAnalysisContainer from './materiality/MaterialityAnalysisContainer';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  return (
    <MaterialityAnalysisContainer 
      formValues={formValues} 
      setFormValues={setFormValues} 
    />
  );
};

export default MaterialityAnalysis;
