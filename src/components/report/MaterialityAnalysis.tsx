
import React, { useEffect } from 'react';
import MaterialityAnalysisContainer from './materiality/MaterialityAnalysisContainer';
import { useToast } from '@/hooks/use-toast';
import { useReport } from '@/context/ReportContext';

interface MaterialityAnalysisProps {
  formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const MaterialityAnalysis: React.FC<MaterialityAnalysisProps> = ({ 
  formValues, 
  setFormValues 
}) => {
  const { toast } = useToast();
  const { saveCurrentReport } = useReport();

  // Auto-save when materiality data changes
  useEffect(() => {
    // Only trigger save if we have materiality data
    if (formValues.materialityAnalysis && 
        (formValues.materialityAnalysis.issues?.length > 0 || 
         formValues.materialityAnalysis.stakeholders?.length > 0)) {
      
      const timeoutId = setTimeout(() => {
        saveCurrentReport()
          .then(() => {
            console.log("Materiality data saved successfully");
          })
          .catch(error => {
            console.error("Error saving materiality data:", error);
            toast({
              title: "Errore di salvataggio",
              description: "Non è stato possibile salvare i dati di materialità",
              variant: "destructive"
            });
          });
      }, 2000); // 2 seconds delay to avoid too frequent saves
      
      return () => clearTimeout(timeoutId);
    }
  }, [formValues.materialityAnalysis, saveCurrentReport, toast]);

  return (
    <MaterialityAnalysisContainer 
      formValues={formValues} 
      setFormValues={setFormValues} 
    />
  );
};

export default MaterialityAnalysis;
