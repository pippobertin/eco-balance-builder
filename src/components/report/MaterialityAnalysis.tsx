
import React, { useEffect } from 'react';
import MaterialityAnalysisContainer from './materiality/MaterialityAnalysisContainer';
import { useAutoSaveMateriality } from './materiality/hooks/useAutoSaveMateriality';
import { useReport } from '@/context/ReportContext';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { saveCurrentReport } = useReport();
  
  // Use the auto-save hook
  useAutoSaveMateriality({
    materialityData: formValues?.materialityAnalysis
  });

  // Save on component unmount (tab change)
  useEffect(() => {
    return () => {
      console.log("MaterialityAnalysis component unmounting, saving changes...");
      saveCurrentReport().catch(console.error);
    };
  }, [saveCurrentReport]);

  return (
    <MaterialityAnalysisContainer 
      formValues={formValues} 
      setFormValues={setFormValues} 
    />
  );
};

export default MaterialityAnalysis;
