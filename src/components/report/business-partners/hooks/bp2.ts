
import { useState, useEffect } from 'react';
import { BP2FormData, BP2HookResult } from './types';
import { useHandleSave } from './useHandleSave';

const initialState: BP2FormData = {
  maleGovernanceMembers: undefined,
  femaleGovernanceMembers: undefined,
  otherGenderGovernanceMembers: undefined,
  genderDiversityIndex: undefined
};

export const useBP2Data = (reportId: string): BP2HookResult => {
  const [formData, setFormData] = useState<BP2FormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [needsSaving, setNeedsSaving] = useState(false);
  
  // Load data effect
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
  
  // Track data changes
  useEffect(() => {
    setNeedsSaving(true);
  }, [formData]);
  
  // Save data function
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
      console.error('Error saving BP2 data:', error);
      return false;
    }
  };
  
  // Wrap saveData with handleSave for Promise<void> compatibility
  const handleSave = useHandleSave(saveData);
  
  return {
    formData,
    setFormData,
    isLoading,
    saveData,
    handleSave,
    lastSaved,
    needsSaving
  };
};
