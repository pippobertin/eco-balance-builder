
import { useState } from 'react';
import { EmissionCalculationLogs, EmissionsResults } from '@/hooks/emissions-calculator/types';
import { useEmissionRecords } from '@/hooks/emissions-calculator/useEmissionRecords';
import { useToast } from '@/hooks/use-toast';

export const useEmissionSubmit = (
  reportId: string | undefined,
  setCalculationLogs: (logs: EmissionCalculationLogs) => void,
  setCalculatedEmissions: (emissions: EmissionsResults) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { loadEmissionRecords, calculateTotals } = useEmissionRecords();
  
  const handleSubmitCalculation = async () => {
    if (!reportId) {
      console.error('Cannot submit calculation: reportId is undefined');
      toast({
        title: "Errore",
        description: "ID Report non valido, impossibile salvare",
        variant: "destructive"
      });
      return null;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Submitting all calculations');
      
      const records = await loadEmissionRecords(reportId);
      console.log('Loaded records:', records);
      
      const totals = calculateTotals(records);
      console.log('Calculated totals:', totals);
      
      const newLogs: EmissionCalculationLogs = {
        scope1Calculations: records.filter(record => record.scope === 'scope1'),
        scope2Calculations: records.filter(record => record.scope === 'scope2'),
        scope3Calculations: records.filter(record => record.scope === 'scope3')
      };
      
      setCalculationLogs(newLogs);
      setCalculatedEmissions(totals);
      
      toast({
        title: "Emissioni salvate",
        description: "Tutti i calcoli sono stati salvati con successo",
      });
      
      return totals;
    } catch (error: any) {
      console.error('Error submitting calculations:', error);
      toast({
        title: "Errore",
        description: `Impossibile salvare i calcoli: ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    handleSubmitCalculation,
    isSaving
  };
};
