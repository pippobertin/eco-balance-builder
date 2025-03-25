
import { useState, useEffect } from 'react';
import { BP1FormData } from './types';
import { useHandleSave } from './useHandleSave';

const initialState: BP1FormData = {
  controversialWeapons: false,
  tobacco: false,
  fossilFuels: false,
  chemicals: false
};

export const useBP1Data = (reportId: string) => {
  const [formData, setFormData] = useState<BP1FormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  
  // Qui implementare la logica per caricare i dati effettivi dal backend
  useEffect(() => {
    // Simulazione caricamento dati
    const loadData = async () => {
      setIsLoading(true);
      // Simula chiamata API
      setTimeout(() => {
        // Dati simulati
        setFormData({
          ...initialState,
          // Aggiungi eventuali dati precaricati qui
        });
        setIsLoading(false);
      }, 500);
    };
    
    loadData();
  }, [reportId]);
  
  // Verifica quando i dati cambiano per segnalare necessità di salvataggio
  useEffect(() => {
    setNeedsSaving(true);
  }, [formData]);
  
  // Funzione per salvare i dati
  const saveData = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simula chiamata API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aggiorna lo stato di salvataggio
      setLastSaved(new Date());
      setNeedsSaving(false);
      setIsLoading(false);
      
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving BP1 data:', error);
      return false;
    }
  };
  
  // Wrapper per funzione di salvataggio per renderla Promise<void>
  const handleSave = useHandleSave(saveData);
  
  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    handleSave, // Aggiungiamo questa per compatibilità con SaveButtonProps
    lastSaved,
    needsSaving
  };
};
