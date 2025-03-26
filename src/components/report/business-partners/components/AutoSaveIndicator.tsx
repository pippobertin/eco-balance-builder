
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Save, Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  needsSaving?: boolean;
  lastSaved: Date | null;
  className?: string;
  isLoading?: boolean;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  needsSaving = false, 
  lastSaved,
  className = '',
  isLoading = false
}) => {
  const formatTime = () => {
    if (!lastSaved) return "Non salvato";
    try {
      return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Data non valida";
    }
  };

  // Base class based on state
  const baseClasses = needsSaving 
    ? 'flex items-center text-sm gap-1 px-3 py-2 rounded-md text-amber-600 bg-amber-50 border border-amber-200' 
    : 'flex items-center text-sm gap-1 px-3 py-2 rounded-md text-green-600 bg-green-50 border border-green-200';

  return (
    <div className={`${baseClasses} ${className}`} data-testid="autosave-indicator">
      {isLoading ? (
        <>
          <Clock className="h-3.5 w-3.5 animate-spin" />
          <span>Salvataggio in corso...</span>
        </>
      ) : needsSaving ? (
        <>
          <Save className="h-3.5 w-3.5" />
          <span>Modifiche non salvate</span>
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Salvato {formatTime()}</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
