
import { useEffect } from 'react';
import { useReport } from '@/context/ReportContext';
import { useToast } from '@/hooks/use-toast';

interface UseAutoSaveMaterialityProps {
  materialityData: any;
}

export const useAutoSaveMateriality = ({ materialityData }: UseAutoSaveMaterialityProps) => {
  const { toast } = useToast();
  const { saveCurrentReport } = useReport();

  // Auto-save when materiality data changes
  useEffect(() => {
    if (materialityData) {
      console.log("Materiality data changed, preparing to auto-save...", materialityData);
      
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
  }, [materialityData, saveCurrentReport, toast]);

  // Initial save on mount
  useEffect(() => {
    if (materialityData) {
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
};
