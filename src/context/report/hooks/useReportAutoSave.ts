
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
  // References for autosave - keeping these for future reference but not using them
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');
  
  // NOTE: Autosave has been completely disabled. Users must save manually using the "Save" button.
  console.log('Autosave is disabled, use manual save only');
  
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
      
      // Clear any existing timer when unmounting
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [needsSaving, saveCurrentReport]);

  // Return the needsSaving state so it can be used in navigation guards
  return {
    needsSaving
  };
};
