
import React from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface SaveIndicatorProps {
  isLoading: boolean;
  isSaving: boolean;
  needsSaving: boolean;
  lastSaved: Date | null;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ 
  isLoading,
  isSaving,
  needsSaving,
  lastSaved 
}) => {
  // Usiamo una funzione per formattare il tempo trascorso dall'ultimo salvataggio
  const formatSaveTime = () => {
    if (!lastSaved) return "Non salvato";
    
    try {
      // Usa formatDistanceToNow per mostrare il tempo trascorso in forma leggibile
      return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Errore nel formato della data:", error, lastSaved);
      return "Data non valida";
    }
  };
  
  // Classe di base per tutti gli stati dell'indicatore
  const baseClasses = "flex items-center text-sm px-3 py-1.5 rounded-md";
  
  if (isSaving) {
    return (
      <div className={`${baseClasses} text-blue-600 bg-blue-50 border border-blue-200`}>
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span>Salvataggio in corso...</span>
      </div>
    );
  }
  
  if (needsSaving) {
    return (
      <div className={`${baseClasses} text-amber-600 bg-amber-50 border border-amber-200`}>
        <Clock className="h-4 w-4 mr-1" />
        <span>Modifiche non salvate</span>
      </div>
    );
  }
  
  if (lastSaved) {
    return (
      <div className={`${baseClasses} text-green-600 bg-green-50 border border-green-200`}>
        <Check className="h-4 w-4 mr-1" />
        <span>Salvato {formatSaveTime()}</span>
      </div>
    );
  }
  
  return (
    <div className={`${baseClasses} text-gray-500 bg-gray-50 border border-gray-200`}>
      <Clock className="h-4 w-4 mr-1" />
      <span>Non ancora salvato</span>
    </div>
  );
};

export default SaveIndicator;
