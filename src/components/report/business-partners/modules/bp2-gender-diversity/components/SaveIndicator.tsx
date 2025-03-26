
import React, { useEffect, useState } from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface SaveIndicatorProps {
  isLoading: boolean;
  isSaving?: boolean;
  needsSaving: boolean;
  lastSaved: Date | null;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ 
  isLoading,
  isSaving = false,
  needsSaving,
  lastSaved 
}) => {
  console.log('SaveIndicator render:', { isLoading, isSaving, needsSaving, lastSaved: lastSaved ? lastSaved.toISOString() : null });
  
  // Aggiungiamo stato locale per evitare flickering e mantenere lo stato salvato
  const [displayState, setDisplayState] = useState({
    isLoading,
    isSaving,
    needsSaving,
    lastSaved
  });

  // Aggiorniamo lo stato locale solo quando le prop cambiano in modo significativo
  useEffect(() => {
    // Quando il salvataggio è completato (isSaving passa da true a false)
    if (displayState.isSaving && !isSaving) {
      console.log('SaveIndicator: Save operation completed');
      setDisplayState({
        isLoading,
        isSaving,
        needsSaving: false, // Forzare needsSaving a false dopo il salvataggio
        lastSaved
      });
    } 
    // Per le altre transizioni di stato
    else if (
      displayState.isLoading !== isLoading ||
      displayState.isSaving !== isSaving ||
      // Aggiorna solo se needsSaving diventa true o se lastSaved è cambiato
      (needsSaving && !displayState.needsSaving) ||
      (lastSaved && (!displayState.lastSaved || lastSaved.getTime() !== displayState.lastSaved.getTime()))
    ) {
      console.log('SaveIndicator: Updating display state due to prop changes');
      setDisplayState({ isLoading, isSaving, needsSaving, lastSaved });
    }
  }, [isLoading, isSaving, needsSaving, lastSaved]);
  
  // Funzione per formattare il tempo trascorso dall'ultimo salvataggio
  const formatSaveTime = () => {
    if (!displayState.lastSaved) return "Non salvato";
    
    try {
      // Usa formatDistanceToNow per mostrare il tempo trascorso in forma leggibile
      return formatDistanceToNow(displayState.lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Errore nel formato della data:", error, displayState.lastSaved);
      return "Data non valida";
    }
  };
  
  // Classe di base per tutti gli stati dell'indicatore
  const baseClasses = "flex items-center text-sm px-3 py-1.5 rounded-md";
  
  // Controllo dello stato di caricamento o salvataggio in corso
  if (displayState.isLoading || displayState.isSaving) {
    return (
      <div className={`${baseClasses} text-blue-600 bg-blue-50 border border-blue-200`} data-testid="save-indicator-loading">
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>{displayState.isSaving ? "Salvataggio in corso..." : "Caricamento..."}</span>
      </div>
    );
  }
  
  // Controllo delle modifiche non salvate
  if (displayState.needsSaving) {
    return (
      <div className={`${baseClasses} text-amber-600 bg-amber-50 border border-amber-200`} data-testid="save-indicator-unsaved">
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  // Controllo dell'ultimo salvataggio
  if (displayState.lastSaved) {
    return (
      <div className={`${baseClasses} text-green-600 bg-green-50 border border-green-200`} data-testid="save-indicator-saved">
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  // Stato predefinito
  return (
    <div className={`${baseClasses} text-gray-500 bg-gray-50 border border-gray-200`} data-testid="save-indicator-default">
      <Clock className="h-4 w-4 mr-1" />
      <span>Non ancora salvato</span>
    </div>
  );
};

export default SaveIndicator;
