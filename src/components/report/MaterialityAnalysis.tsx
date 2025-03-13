
import React, { useEffect } from 'react';
import MaterialityAnalysisContainer from './materiality/MaterialityAnalysisContainer';
import { useAutoSaveMateriality } from './materiality/hooks/useAutoSaveMateriality';
import { useReport } from '@/hooks/use-report-context';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { saveCurrentReport } = useReport();
  
  // Use the auto-save hook for the materiality data
  useAutoSaveMateriality({
    materialityData: formValues?.materialityAnalysis
  });

  // Save on component unmount (tab change)
  useEffect(() => {
    const saveChanges = () => {
      try {
        console.log("MaterialityAnalysis component unmounting, saving changes...");
        return saveCurrentReport();
      } catch (error) {
        console.error("Error saving materiality analysis on unmount:", error);
        return Promise.reject(error);
      }
    };

    return () => {
      saveChanges().catch(console.error);
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
