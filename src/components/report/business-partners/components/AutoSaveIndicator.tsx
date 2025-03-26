
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Save, Check } from 'lucide-react';

interface AutoSaveIndicatorProps {
  needsSaving?: boolean;
  lastSaved: Date | null;
  className?: string;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ 
  needsSaving = false, 
  lastSaved,
  className = '' 
}) => {
  const displayText = lastSaved 
    ? formatDistanceToNow(lastSaved, { addSuffix: true, locale: it })
    : "Non salvato";

  const baseClasses = needsSaving 
    ? 'flex items-center text-sm gap-1 px-3 py-2 rounded-md text-amber-600 bg-amber-50 border border-amber-200' 
    : 'flex items-center text-sm gap-1 px-3 py-2 rounded-md text-green-600 bg-green-50 border border-green-200';

  return (
    <div className={`${baseClasses} ${className}`}>
      {needsSaving ? (
        <>
          <Save className="h-3.5 w-3.5" />
          <span>Modifiche non salvate</span>
        </>
      ) : (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Salvato {displayText}</span>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
