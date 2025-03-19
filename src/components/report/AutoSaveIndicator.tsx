
import React, { useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock } from 'lucide-react';

interface AutoSaveIndicatorProps {
  needsSaving: boolean;
  lastSaved: Date | null;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ needsSaving, lastSaved }) => {
  const displayText = useMemo(() => {
    if (!lastSaved) return "Non salvato";
    return formatDistanceToNow(lastSaved, { addSuffix: true, locale: it });
  }, [lastSaved]);

  // Log the state for debugging
  console.info("AutoSaveIndicator state:", { needsSaving, lastSaved, displayText });

  return (
    <div className={`flex items-center text-sm gap-1 px-2 py-1 rounded-md ${
      needsSaving ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'
    }`}>
      <Clock className="h-3.5 w-3.5" />
      <span>
        {needsSaving ? 'Salvataggio in corso...' : `Salvato ${displayText}`}
      </span>
    </div>
  );
};

export default AutoSaveIndicator;
