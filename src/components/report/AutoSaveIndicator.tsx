
import React, { useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Save } from 'lucide-react';

interface AutoSaveIndicatorProps {
  needsSaving?: boolean;
  lastSaved: Date | null;
  className?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  needsSaving = false, 
  lastSaved,
  className = '' // Default to empty string
}) => {
  const displayText = useMemo(() => {
    if (!lastSaved) return "Non salvato";
    return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
  }, [lastSaved]);

  const baseClasses = needsSaving 
    ? 'flex items-center text-sm gap-1 px-2 py-1 rounded-md text-amber-600 bg-amber-50' 
    : 'flex items-center text-sm gap-1 px-2 py-1 rounded-md text-green-600 bg-green-50';

  return (
    <div className={`${baseClasses} ${className}`}>
      {needsSaving ? (
        <>
          <Save className="h-3.5 w-3.5" />
          <span>Modifiche non salvate! Clicca su "Salva"</span>
        </>
      ) : (
        <>
          <Clock className="h-3.5 w-3.5" />
          <span>Salvato {displayText}</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
