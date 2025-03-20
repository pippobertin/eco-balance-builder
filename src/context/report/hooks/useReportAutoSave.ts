
import { useEffect, useRef } from 'react';
import { Report, ReportData } from '@/context/types';

export const useReportAutoSave = (
  needsSaving: boolean,
  reportData: ReportData,
  currentReport: Report | null,
  saveCurrentReport: () => Promise<void>,
  setNeedsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setLastSaved: React.Dispatch<React.SetStateAction<Date | null>>
) => {
  // Create auto-save functionality
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  
  // AUTOSAVE DISABILITATO
  // L'auto-save è stato disabilitato. Gli utenti devono salvare manualmente usando il pulsante "Salva"
  
  // Add a safety mechanism to ensure data is saved before navigation
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (needsSaving) {
        // Only show confirmation dialog if there are unsaved changes
        e.preventDefault();
        e.returnValue = 'Hai modifiche non salvate. Sei sicuro di voler lasciare questa pagina?';
        return 'Hai modifiche non salvate. Sei sicuro di voler lasciare questa pagina?';
      }
      return undefined;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [needsSaving, saveCurrentReport]);

  // Return the needsSaving state so it can be used in navigation guards
  return {
    needsSaving
  };
};
