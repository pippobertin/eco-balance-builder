
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
    if (formValues?.materialityAnalysis) {
      console.log("Materiality data changed, preparing to auto-save...", formValues.materialityAnalysis);
      
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
      }, 1000); // 1 second delay to avoid too frequent saves
      
      return () => clearTimeout(timeoutId);
    }
  }, [formValues.materialityAnalysis, saveCurrentReport, toast]);

  // Force an immediate save when the component mounts
  useEffect(() => {
    if (formValues?.materialityAnalysis) {
      console.log("MaterialityAnalysis component mounted, forcing immediate save");
      saveCurrentReport()
        .then(() => console.log("Initial materiality data save successful"))
        .catch(error => {
          console.error("Error saving initial materiality data:", error);
          toast({
            title: "Errore di salvataggio iniziale",
            description: "Non è stato possibile salvare i dati di materialità iniziali",
            variant: "destructive"
          });
        });
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <MaterialityAnalysisContainer 
      formValues={formValues} 
      setFormValues={setFormValues} 
    />
  );
};

export default MaterialityAnalysis;
