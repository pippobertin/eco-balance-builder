
import React from 'react';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  // This is just a placeholder component since materiality analysis has been removed
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
      <p className="text-gray-500">La sezione Materialità è stata rimossa.</p>
    </div>
  );
};

export default MaterialityAnalysis;
