
import { useEffect, useRef } from 'react';
import { BusinessPartnersFormData } from './types';

export const useBusinessPartnersChanges = (
  formData: BusinessPartnersFormData,
  isLoading: boolean,
  setNeedsSaving: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) => {
  // Ref per tenere traccia dei dati precedenti
  const prevDataRef = useRef<BusinessPartnersFormData | null>(null);
  
  // Monitora i cambiamenti nel formData per impostare lo stato needsSaving
  useEffect(() => {
    // Non aggiornare needsSaving durante il caricamento iniziale
    if (isLoading) return;
    
    console.log('Checking for Business Partners form changes');
    
    // Controlla se il prevDataRef è già stato inizializzato
    if (prevDataRef.current) {
      const needsSavingMap: Record<string, boolean> = {};
      
      // Controlla BP1
      needsSavingMap.bp1 = JSON.stringify(prevDataRef.current.bp1) !== JSON.stringify(formData.bp1);
      console.log('BP1 needs saving:', needsSavingMap.bp1);
      
      // Controlla BP2
      needsSavingMap.bp2 = JSON.stringify(prevDataRef.current.bp2) !== JSON.stringify(formData.bp2);
      
      // Controlla BP3
      needsSavingMap.bp3 = JSON.stringify(prevDataRef.current.bp3) !== JSON.stringify(formData.bp3);
      
      // Controlla BP4
      needsSavingMap.bp4 = JSON.stringify(prevDataRef.current.bp4) !== JSON.stringify(formData.bp4);
      
      // Controlla BP5
      needsSavingMap.bp5 = JSON.stringify(prevDataRef.current.bp5) !== JSON.stringify(formData.bp5);
      
      // Controlla BP6
      needsSavingMap.bp6 = JSON.stringify(prevDataRef.current.bp6) !== JSON.stringify(formData.bp6);
      
      // Controlla BP7
      needsSavingMap.bp7 = JSON.stringify(prevDataRef.current.bp7) !== JSON.stringify(formData.bp7);
      
      // Controlla BP8
      needsSavingMap.bp8 = JSON.stringify(prevDataRef.current.bp8) !== JSON.stringify(formData.bp8);
      
      // Controlla BP9
      needsSavingMap.bp9 = JSON.stringify(prevDataRef.current.bp9) !== JSON.stringify(formData.bp9);
      
      // Controlla BP10
      needsSavingMap.bp10 = JSON.stringify(prevDataRef.current.bp10) !== JSON.stringify(formData.bp10);
      
      // Controlla BP11
      needsSavingMap.bp11 = JSON.stringify(prevDataRef.current.bp11) !== JSON.stringify(formData.bp11);
      
      console.log('Needs saving map:', needsSavingMap);
      setNeedsSaving(needsSavingMap);
    }
    
    // Aggiorna il prevDataRef con i dati correnti
    prevDataRef.current = { ...formData };
  }, [formData, isLoading, setNeedsSaving]);
};
